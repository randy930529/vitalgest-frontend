import { Suspense } from "react";
import Link from "next/link";
import { UserType } from "@/app/lib/definitions";
import { HeaderStats } from "@/app/ui/home/stast-home";
import ImageLoading from "@/app/ui/components/image-loading";
import HeaderStatsSkeleton from "@/app/ui/components/skeletons";

export default async function Header({ user }: { user: UserType }) {
  return (
    <header className="relative isolate overflow-hidden md:pt-4" role="banner">
      <div className="absolute inset-0 -z-20">
        <ImageLoading
          src="/images/image-banner.jpg"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          alt="Personal y ambulancias de la Cruz Roja Mexicana en operación"
        />
      </div>

      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-950/78 via-slate-900/62 to-blue-950/68" />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-3 pb-8 pt-20 sm:px-5 sm:pb-10 sm:pt-24 md:gap-8 md:pt-24">
        <section
          aria-labelledby="home-hero-title"
          className="grid gap-5 rounded-3xl border border-white/20 bg-slate-900/35 p-4 text-white shadow-[0_30px_70px_-45px_rgba(15,23,42,0.95)] backdrop-blur-md md:grid-cols-[1.2fr,1fr] md:gap-8 md:p-7"
        >
          <div>
            <p className="inline-flex items-center rounded-full border border-white/35 bg-white/10 px-3 py-1 text-xs font-semibold tracking-[0.14em] text-slate-100">
              Centro Operativo Digital
            </p>
            <h1
              id="home-hero-title"
              className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl"
            >
              Cruz Roja Mexicana
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-100/90 sm:text-base">
              Valida tu guardia en curso, completa checklist y administra el
              historial de guardias.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="#guardia-curso-title"
                className="inline-flex items-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100"
              >
                Crear guardia
              </Link>
              <Link
                href="#guardia-curso-title"
                className="inline-flex items-center rounded-xl border border-white/40 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                Continuar checklist
              </Link>
            </div>

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-100/90 sm:text-sm">
              <Link
                href="#guardia-curso-title"
                className="underline-offset-4 hover:underline"
              >
                Ver guardia actual
              </Link>
              <Link
                href="#historial-guardias-title"
                className="underline-offset-4 hover:underline"
              >
                Ir al historial
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-white/20 bg-slate-950/35 p-3 sm:p-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-rose-100">
              Resumen operativo
            </h2>
            <div className="mt-3">
              <Suspense fallback={<HeaderStatsSkeleton />}>
                <HeaderStats user={user} />
              </Suspense>
            </div>
          </div>
        </section>
      </div>
    </header>
  );
}
