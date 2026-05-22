import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AppWorkspace } from "@/components/AppWorkspace";
import { apps, getApp } from "@/lib/apps";

export function generateStaticParams() {
  return apps.map((app) => ({ slug: app.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const app = getApp(params.slug);
  return {
    title: app ? `${app.title} | Statistical Apps Portfolio` : "Statistical App"
  };
}

export default function AppPage({ params }: { params: { slug: string } }) {
  const app = getApp(params.slug);
  if (!app) notFound();

  return (
    <main className="page-shell detail-shell">
      <Link href="/" className="back-link">
        <ArrowLeft size={18} /> Portfolio home
      </Link>
      <AppWorkspace app={app} />
    </main>
  );
}
