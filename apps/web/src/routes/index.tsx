import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <main className="grid min-h-screen place-items-center bg-zinc-950 px-6 text-zinc-50">
      <h1 className="text-3xl font-semibold">hello world</h1>
    </main>
  );
}
