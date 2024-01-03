import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <div>Create a story, easily illustrate with AI</div>
        <a className="underline" href="/create">
          Get Started
        </a>
      </div>
    </main>
  );
}
