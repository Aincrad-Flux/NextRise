import { notFound } from "next/navigation";

export default function Home() {
  // Aucune page frontend ici; ce backend expose seulement des APIs
  notFound();
  return null;
}
