"use client";

import { supabase } from "@/lib/supabase";
import { Shell } from "@/components/Shell";
import { getSession, clearSession } from "@/lib/callSession";
import {
  CircleDot, Delete, Grid3X3, Mic, MicOff,
  Phone, PlusCircle, Video, Volume2, VolumeX,
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
  const incoming = searchParams.get("incoming") === "true";
  const number = searchParams.get("number") || "Unknown";
  const type = searchParams.get("type") || "call";

  const [callId, setCallId] = useState<string | null>(null);
  const [callStatus, setCallStatus] = useState<"Calling" | "Incoming" | "Ringing" | "In Call" | "Call Ended">(
    incoming ? "Incoming" : "Calling"
  );

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const hasCreatedCall = useRef(false);

  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(true);
  const [hold, setHold] = useState(false);
  const [record, setRecord] = useState(false);
  const [showKeypad, setShowKeypad] = useState(false);
  const [dtmfNumber, setDtmfNumber] = useState("");
  const [videoEnabled, setVideoEnabled] = useState(false);

  // ─── Listen JsSIP session events ─────────────────────────────────────────
  useEffect(() => {
    const session = getSession();
    if (!session) {
      console.error("No session found");
      return;
    }

    session.on("progress", () => {
      if (!incoming) setCallStatus("Ringing");
    });

    session.on("confirmed", () => {
      setCallStatus("In Call");
      setSeconds(0);
      attachRemoteAudio(session);
    });

    session.on("ended", () => {
      setCallStatus("Call Ended");
      setTimeout(() => router.push("/dashboard"), 2000);
    });

    session.on("failed", () => {
      setCallStatus("Call Ended");
      setTimeout(() => router.push("/dashboard"), 2000);
    });
  }, []);

  // ─── Attach remote audio ──────────────────────────────────────────────────
  function attachRemoteAudio(session: any) {
    const pc: RTCPeerConnection = session.connection;
    if (!pc) return;

    pc.ontrack = (event) => {
      const [remoteStream] = event.streams;
      if (!remoteStream) return;

      const hasVideo = remoteStream.getVideoTracks().length > 0;

      if (hasVideo && remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current.play().catch(console.error);
      }

      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = remoteStream;
        remoteAudioRef.current.play().catch(console.error);
      }
    };
  }

  // ─── Timer ────────────────────────────────────────────────────────────────
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (callStatus === "In Call") {
      interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  // ─── Local media (audio only saat init) ──────────────────────────────────
  useEffect(() => {
    async function startMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        mediaStreamRef.current = stream;
      } catch (err) {
        console.error("Media error:", err);
      }
    }
    startMedia();
    return () => stopMedia();
  }, []);

  // ─── Insert call record (outgoing only) ───────────────────────────────────
  useEffect(() => {
    if (incoming || hasCreatedCall.current) return;
    hasCreatedCall.current = true;

    async function createCall() {
      const user = JSON.parse(localStorage.getItem("voip_user") || "{}");
      if (!user?.id) return;
      const { data, error } = await supabase
        .from("calls")
        .insert({
          user_id: user.id,
          destination_number: number,
          call_type: "voice",
          direction: "outgoing",
          status: "calling",
          started_at: new Date().toISOString(),
        })
        .select()
        .single();
      if (!error && data) setCallId(data.id);
    }
    createCall();
  }, []);

  // ─── Helpers ──────────────────────────────────────────────────────────────
  function stopMedia() {
    mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    mediaStreamRef.current = null;
  }

  async function updateCallRecord(result: "ended" | "missed" | "rejected") {
    if (!callId) return;
    await supabase
      .from("calls")
      .update({
        status: "ended",
        result,
        ended_at: new Date().toISOString(),
        duration: seconds,
      })
      .eq("id", callId);
  }

  // ─── Actions ──────────────────────────────────────────────────────────────
  function answerCall() {
    const session = getSession();
    if (!session) {
      console.error("No session to answer");
      return;
    }
    session.answer({
      mediaConstraints: { audio: true, video: false },
    });
  }

  function rejectCall() {
    const session = getSession();
    if (session) session.terminate();
    clearSession();
    router.push("/dashboard");
  }

  async function endCall() {
    const session = getSession();
    if (session) {
      try {
        session.terminate();
      } catch (e) {
        console.error("Terminate error:", e);
      }
    }
    clearSession();
    stopMedia();
    await updateCallRecord(seconds === 0 ? "missed" : "ended");
    router.push("/dashboard");
  }

  function toggleMute() {
    const session = getSession();
    if (!session) return;
    if (!muted) {
      session.mute();
    } else {
      session.unmute();
    }
    setMuted(!muted);
  }

  function toggleSpeaker() {
    const next = !speaker;
    if (remoteAudioRef.current) {
      remoteAudioRef.current.muted = !next;
      remoteAudioRef.current.volume = next ? 1 : 0;
    }
    setSpeaker(next);
  }

  function toggleHold() {
    const session = getSession();
    if (!session) return;
    if (!hold) {
      session.hold();
    } else {
      session.unhold();
    }
    setHold(!hold);
  }

  function toggleRecord() {
    const stream = mediaStreamRef.current;
    if (!stream) return;

    if (!record) {
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
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

  function sendDtmf(key: string) {
    const session = getSession();
    if (!session) return;
    session.sendDTMF(key);
    setDtmfNumber((prev) => prev + key);
  }

  // ─── Toggle Video (upgrade/downgrade call) ────────────────────────────────
  async function toggleVideo() {
    const session = getSession();
    if (!session || callStatus !== "In Call") return;

    if (!videoEnabled) {
      // Upgrade: tambah video track
      try {
        const videoStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

        const videoTrack = videoStream.getVideoTracks()[0];

        // Tambah ke local stream
        mediaStreamRef.current?.addTrack(videoTrack);

        // Tampilkan local video
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = mediaStreamRef.current;
        }

        // Tambah track ke PeerConnection lalu renegotiate
        const pc: RTCPeerConnection = session.connection;
        await pc.addTrack(videoTrack, mediaStreamRef.current!);

        session.renegotiate(
          { useUpdate: false },
          (success: boolean) => {
            if (success) {
              console.log("Renegotiate video SUCCESS");
              setVideoEnabled(true);

              // Listen remote video track setelah renegotiate
              pc.ontrack = (event) => {
                const [remoteStream] = event.streams;
                if (!remoteStream) return;

                if (
                  remoteStream.getVideoTracks().length > 0 &&
                  remoteVideoRef.current
                ) {
                  remoteVideoRef.current.srcObject = remoteStream;
                  remoteVideoRef.current.play().catch(console.error);
                }
              };
            } else {
              console.error("Renegotiate FAILED");
              // Rollback
              videoTrack.stop();
              mediaStreamRef.current?.removeTrack(videoTrack);
              if (localVideoRef.current) localVideoRef.current.srcObject = null;
              alert("Server tidak support video call");
            }
          }
        );
      } catch (err) {
        console.error("Camera error:", err);
        alert("Tidak bisa akses kamera");
      }
    } else {
      // Downgrade: hapus video track
      const stream = mediaStreamRef.current;
      if (!stream) return;

      stream.getVideoTracks().forEach((track) => {
        track.stop();
        stream.removeTrack(track);
      });

      if (localVideoRef.current) localVideoRef.current.srcObject = null;
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

      session.renegotiate({ useUpdate: false }, (success: boolean) => {
        if (success) {
          console.log("Video disabled");
          setVideoEnabled(false);
        }
      });
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <Shell>
      <section className="flex min-h-[calc(100vh-150px)] items-center justify-center px-5 py-10">
        <div className="w-full max-w-5xl rounded-[1.75rem] bg-brand-navy px-8 py-8 text-white shadow-2xl shadow-blue-950/20">
          <div className="flex flex-col items-center">

            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-blue text-4xl font-black text-white">
              RD
            </div>

            <h1 className="mt-6 text-xl font-black">{number}</h1>

            <p className="mt-1 text-xs font-bold uppercase tracking-wide text-white/30">
              {callStatus === "In Call" && hold ? "ON HOLD" : callStatus} · via Kamailio SIP ·{" "}
              {videoEnabled ? "Video Call" : "Voice Call"}
            </p>

            {/* Answer / Reject */}
            {callStatus === "Incoming" && (
              <div className="mt-5 flex gap-4">
                <button
                  onClick={answerCall}
                  className="rounded-full bg-green-500 px-8 py-3 font-bold text-white transition hover:bg-green-600"
                >
                  Answer
                </button>
                <button
                  onClick={rejectCall}
                  className="rounded-full bg-red-500 px-8 py-3 font-bold text-white transition hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            )}

            {/* Timer */}
            <p className="mt-6 font-mono text-3xl font-black">
              {formatTime(seconds)}
            </p>

            {/* Video area — muncul hanya saat videoEnabled */}
            {videoEnabled && (
              <div className="mt-6 grid w-full max-w-3xl gap-4 md:grid-cols-2">
                <div className="relative overflow-hidden rounded-2xl bg-black">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="h-64 w-full object-cover"
                  />
                  <p className="absolute bottom-2 left-3 text-xs font-bold text-white/60">
                    You
                  </p>
                </div>

                <div className="relative overflow-hidden rounded-2xl bg-black">
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="h-64 w-full object-cover"
                  />
                  <p className="absolute bottom-2 left-3 text-xs font-bold text-white/60">
                    {number}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Call action buttons */}
          <div className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
            <CallAction
              icon={muted ? <MicOff size={22} /> : <Mic size={22} />}
              label={muted ? "Muted" : "Mute"}
              active={muted}
              onClick={toggleMute}
            />
            <CallAction
              icon={speaker ? <Volume2 size={22} /> : <VolumeX size={22} />}
              label={speaker ? "Speaker On" : "Speaker Off"}
              active={speaker}
              onClick={toggleSpeaker}
            />
            <CallAction
              icon={<PlusCircle size={22} />}
              label={hold ? "Resume" : "Hold"}
              active={hold}
              onClick={toggleHold}
            />
            <CallAction
              icon={<CircleDot size={22} />}
              label={record ? "Recording..." : "Record"}
              active={record}
              onClick={toggleRecord}
            />
            {/* Tombol Video Call */}
            <CallAction
              icon={<Video size={22} />}
              label={videoEnabled ? "Stop Video" : "Video Call"}
              active={videoEnabled}
              onClick={toggleVideo}
            />
            <CallAction
              icon={<Grid3X3 size={22} />}
              label="Keypad"
              active={showKeypad}
              onClick={() => setShowKeypad(!showKeypad)}
            />
          </div>

          {/* DTMF Keypad */}
          {showKeypad && (
            <div className="mx-auto mt-5 max-w-3xl rounded-2xl bg-white/10 p-4">
              <div className="mb-4 rounded-xl bg-white/15 px-4 py-3 text-center font-mono text-xl font-black">
                {dtmfNumber || "DTMF Keypad"}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {keypad.map((key) => (
                  <button
                    key={key}
                    onClick={() => sendDtmf(key)}
                    className="rounded-xl bg-white/15 py-3 text-xl font-black text-white hover:bg-white/25"
                  >
                    {key}
                  </button>
                ))}
                <button
                  onClick={() => setDtmfNumber((prev) => prev.slice(0, -1))}
                  className="col-span-3 flex items-center justify-center gap-2 rounded-xl bg-white/15 py-3 font-bold text-white hover:bg-white/25"
                >
                  <Delete size={18} /> Hapus
                </button>
              </div>
            </div>
          )}

          <audio ref={remoteAudioRef} autoPlay />

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
  icon, label, active, onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-5 py-4 text-sm font-bold transition ${
        active
          ? "bg-white text-brand-navy ring-4 ring-brand-blue"
          : "bg-white/15 text-white hover:bg-white/25"
      }`}
    >
      <span className="mx-auto mb-1 flex justify-center">{icon}</span>
      {label}
    </button>
  );
}