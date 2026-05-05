"use client";

import { Shell } from "@/components/Shell";
import {
  CircleDot,
  Delete,
  Grid3X3,
  Mic,
  MicOff,
  Phone,
  PlusCircle,
  Video,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

const keypad = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];

function formatTime(seconds: number) {
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export default function CallPage() {
  return (
    <Suspense fallback={<div>Loading call...</div>}>
      <CallScreen />
    </Suspense>
  );
}

function CallScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const number = searchParams.get("number") || "+62 821 9876 5432";
  const type = searchParams.get("type") || "call";

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);
  const [hold, setHold] = useState(false);
  const [record, setRecord] = useState(false);
  const [showKeypad, setShowKeypad] = useState(false);
  const [dtmfNumber, setDtmfNumber] = useState("");
  const [cameraOn, setCameraOn] = useState(false);

  useEffect(() => {
    if (hold) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [hold]);

  useEffect(() => {
    async function startMedia() {
      try {
        stopMedia();

        const stream = await navigator.mediaDevices.getUserMedia({
          video: type === "video",
          audio: true,
        });

        mediaStreamRef.current = stream;

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        setCameraOn(type === "video");
      } catch (error) {
        console.error("Media permission denied:", error);
        setCameraOn(false);
      }
    }

    startMedia();

    return () => {
      stopMedia();
    };
  }, [type]);

  function stopMedia() {
    const stream = mediaStreamRef.current;

    stream?.getTracks().forEach((track) => {
      track.stop();
    });

    mediaStreamRef.current = null;
  }

  function toggleMute() {
    const stream = mediaStreamRef.current;
    if (!stream) return;

    stream.getAudioTracks().forEach((track) => {
      track.enabled = muted;
    });

    setMuted(!muted);
  }

  function toggleSpeaker() {
    const video = localVideoRef.current;

    if (video) {
      video.muted = speaker;
    }

    setSpeaker(!speaker);
  }

  function toggleRecord() {
    const stream = mediaStreamRef.current;
    if (!stream) return;

    if (!record) {
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: "video/webm",
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");

        a.href = url;
        a.download = `call-recording-${Date.now()}.webm`;
        a.click();

        URL.revokeObjectURL(url);
      };

      recorder.start();
      setRecord(true);
    } else {
      mediaRecorderRef.current?.stop();
      setRecord(false);
    }
  }

  function switchCallMode() {
    stopMedia();

    const nextType = type === "video" ? "call" : "video";

    const query = new URLSearchParams({
      number,
      type: nextType,
    });

    router.push(`/dashboard/call?${query.toString()}`);
  }

  function endCall() {
    if (record) {
      mediaRecorderRef.current?.stop();
    }

    stopMedia();
    router.push("/dashboard");
  }

  return (
    <Shell>
      <section className="flex min-h-[calc(100vh-150px)] items-center justify-center px-5 py-10">
        <div className="w-full max-w-5xl rounded-[1.75rem] bg-[var(--color-brand-navy)] px-8 py-8 text-white shadow-2xl shadow-blue-950/20">
          <div className="flex flex-col items-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[var(--color-brand-blue)] text-4xl font-black text-white">
              RD
            </div>

            <h1 className="mt-6 text-xl font-black">{number}</h1>

            <p className="mt-1 text-xs font-bold uppercase tracking-wide text-white/30">
              {hold ? "ON HOLD" : "IN CALL"} · via Kamailio SIP ·{" "}
              {type === "video" ? "Video Call" : "Voice Call"}
            </p>

            <p className="mt-6 font-mono text-3xl font-black">
              {formatTime(seconds)}
            </p>

            {type === "video" && (
              <div className="mt-6 grid w-full max-w-3xl gap-4 md:grid-cols-2">
                <div className="relative overflow-hidden rounded-2xl bg-black">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="h-64 w-full object-cover"
                  />

                  {!cameraOn && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black text-sm font-bold text-white/50">
                      Menunggu izin kamera...
                    </div>
                  )}
                </div>

                <div className="flex h-64 items-center justify-center rounded-2xl bg-white/10">
                  <div className="text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-brand-blue)] text-2xl font-black">
                      RD
                    </div>
                    <p className="mt-3 text-sm font-bold text-white/60">
                      Remote video placeholder
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
            <CallAction
              icon={muted ? <MicOff size={22} /> : <Mic size={22} />}
              label={muted ? "Muted" : "Mute"}
              active={muted}
              onClick={toggleMute}
            />

            <CallAction
              icon={speaker ? <VolumeX size={22} /> : <Volume2 size={22} />}
              label={speaker ? "Speaker Off" : "Speaker"}
              active={speaker}
              onClick={toggleSpeaker}
            />

            <CallAction
              icon={<PlusCircle size={22} />}
              label={hold ? "Resume" : "Hold"}
              active={hold}
              onClick={() => setHold(!hold)}
            />

            <CallAction
              icon={<CircleDot size={22} />}
              label={record ? "Recording..." : "Record"}
              active={record}
              onClick={toggleRecord}
            />

            <CallAction
              icon={type === "video" ? <Phone size={22} /> : <Video size={22} />}
              label={type === "video" ? "Voice Call" : "Video Call"}
              active={false}
              onClick={switchCallMode}
            />

            <CallAction
              icon={<Grid3X3 size={22} />}
              label="Keypad"
              active={showKeypad}
              onClick={() => setShowKeypad(!showKeypad)}
            />
          </div>

          {showKeypad && (
            <div className="mx-auto mt-5 max-w-3xl rounded-2xl bg-white/10 p-4">
              <div className="mb-4 rounded-xl bg-white/15 px-4 py-3 text-center font-mono text-xl font-black">
                {dtmfNumber || "DTMF Keypad"}
              </div>

              <div className="grid grid-cols-3 gap-3">
                {keypad.map((key) => (
                  <button
                    key={key}
                    onClick={() => setDtmfNumber((prev) => prev + key)}
                    className="rounded-xl bg-white/15 py-3 text-xl font-black text-white hover:bg-white/25"
                  >
                    {key}
                  </button>
                ))}

                <button
                  onClick={() => setDtmfNumber((prev) => prev.slice(0, -1))}
                  className="col-span-3 flex items-center justify-center gap-2 rounded-xl bg-white/15 py-3 font-bold text-white hover:bg-white/25"
                >
                  <Delete size={18} />
                  Hapus
                </button>
              </div>
            </div>
          )}

          <button
            onClick={endCall}
            className="mx-auto mt-6 flex w-full max-w-3xl items-center justify-center gap-3 rounded-full bg-red-500 px-6 py-4 text-base font-black text-white transition hover:bg-red-600"
          >
            <Phone size={18} />
            Akhiri Panggilan
          </button>
        </div>
      </section>
    </Shell>
  );
}

function CallAction({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-5 py-4 text-sm font-bold transition ${active
          ? "bg-white text-[var(--color-brand-navy)] ring-4 ring-[var(--color-brand-blue)]"
          : "bg-white/15 text-white hover:bg-white/25"
        }`}
    >
      <span className="mx-auto mb-1 flex justify-center">{icon}</span>
      {label}
    </button>
  );
}