const logs = [
  {
    type: "call",
    time: "04 Mei 2026, 10:24",
    status: "Ended",
    result: "received",
    duration: "02:14",
    number: "1002",
  },
  {
    type: "call",
    time: "04 Mei 2026, 09:18",
    status: "Call Ended",
    result: "missed",
    duration: "00:00",
    number: "1005",
  },
  {
    type: "video call",
    time: "03 Mei 2026, 20:44",
    status: "Ended",
    result: "ended",
    duration: "11:08",
    number: "1008",
  },
];

export function CallLogTable() {
  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-blue-950/5">
      <div className="border-b border-slate-100 p-6">
        <h2 className="text-2xl font-bold text-[var(--color-brand-navy)]">Riwayat Panggilan</h2>
        <p className="mt-1 text-sm text-slate-500">History call sesuai requirement project.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left">
          <thead className="bg-[var(--color-brand-light)] text-sm text-[var(--color-brand-navy)]">
            <tr>
              <th className="px-6 py-4">Jenis</th>
              <th className="px-6 py-4">Waktu</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Hasil</th>
              <th className="px-6 py-4">Durasi</th>
              <th className="px-6 py-4">Nomor Tujuan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {logs.map((log, index) => (
              <tr key={index} className="hover:bg-slate-50">
                <td className="px-6 py-5 font-semibold capitalize">{log.type}</td>
                <td className="px-6 py-5 text-slate-500">{log.time}</td>
                <td className="px-6 py-5">
                  <span className="rounded-full bg-[var(--color-brand-light)] px-3 py-1 font-semibold text-[var(--color-brand-navy)]">
                    {log.status}
                  </span>
                </td>
                <td className="px-6 py-5 capitalize text-slate-500">{log.result}</td>
                <td className="px-6 py-5 font-bold">{log.duration}</td>
                <td className="px-6 py-5 font-bold">{log.number}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
