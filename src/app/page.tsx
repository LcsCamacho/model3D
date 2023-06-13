import ComputersCanvas from "@/components/Computers";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-3 p-12">
      <div>
        <span>Objeto 3D</span>
      </div>
      <ComputersCanvas />
    </main>
  );
}
