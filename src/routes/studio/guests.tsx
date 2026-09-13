import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingState, ErrorState } from "@/components/state-panel";
import { useLang } from "@/lib/lang";
import { getGuestRelationshipOverview, type GuestRelationshipOverview } from "@/lib/menu/guest-relationships";

export const Route = createFileRoute("/studio/guests")({ component: GuestsPage });

type State = { status: "loading" } | { status: "error"; message: string } | { status: "ready"; data: GuestRelationshipOverview };

function GuestsPage() {
  const { lang } = useLang();
  const [state, setState] = useState<State>({ status: "loading" });
  const [refreshing, setRefreshing] = useState(false);
  async function load(refresh = false) {
    if (refresh) setRefreshing(true); else setState({ status: "loading" });
    const result = await getGuestRelationshipOverview({ data: {} });
    setState(result.ok ? { status: "ready", data: result.data } : { status: "error", message: result.error });
    setRefreshing(false);
  }
  useEffect(() => { void load(); }, []);
  if (state.status === "loading") return <div className="mx-auto max-w-6xl"><LoadingState /></div>;
  if (state.status === "error") return <div className="mx-auto max-w-6xl"><ErrorState message={state.message} /></div>;
  const d = state.data;
  const isAr = lang === "ar";
  const formatNumber = (value: number) => Number(value).toLocaleString(isAr ? "ar-SA" : "en-US");
  const cards = [
    { title: isAr ? "برنامج الولاء" : "Loyalty", text: isAr ? `${formatNumber(d.loyaltyMembers)} عضو · ${formatNumber(d.loyaltyPoints)} نقطة` : `${formatNumber(d.loyaltyMembers)} members · ${formatNumber(d.loyaltyPoints)} points` },
    { title: isAr ? "التقييمات والملاحظات" : "Feedback / Reviews", text: isAr ? `${formatNumber(d.feedbackCount)} ملاحظة${d.averageRating == null ? "" : ` · متوسط ${d.averageRating.toFixed(1)}/5`}` : `${formatNumber(d.feedbackCount)} feedback records${d.averageRating == null ? "" : ` · ${d.averageRating.toFixed(1)}/5 average`}` },
    { title: isAr ? "الحملات" : "Campaigns", text: isAr ? `${formatNumber(d.campaignDrafts)} مسودة حملة · الإرسال يظل يدويًا` : `${formatNumber(d.campaignDrafts)} campaign drafts · outbound remains manual` },
    { title: isAr ? "الاحتفاظ" : "Retention", text: d.evidence === "verified" ? (isAr ? "الدليل الحالي يسمح بقراءة موثوقة ضمن النطاق المتاح." : "Current evidence supports a verified interpretation within the available scope.") : (isAr ? "الأدلة الحالية غير كافية لتفسير قوي للاحتفاظ بعد." : "Current evidence is not sufficient for a strong retention interpretation yet.") },
  ];
  return <div className="mx-auto grid max-w-6xl gap-6 pb-8">
    <header className="rounded-3xl border border-line bg-ink p-6 text-paper md:p-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-paper/70">R9 · {isAr ? "علاقات الضيوف" : "Guest relationships"}</p>
          <h1 className="mt-3 font-display text-3xl font-semibold md:text-4xl">{isAr ? "إدارة الضيوف والاحتفاظ" : "Guest CRM & Retention"}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-paper/70">{isAr ? "رؤى علاقات الضيوف مبنية على بيانات الطلبات الفعلية، مع تحكم كامل للمالك ودون رسائل أو مكافآت أو تغييرات تلقائية." : "Evidence-first guest relationship intelligence from real order data. Owner-controlled and non-autonomous."}</p>
        </div>
        <Button type="button" variant="outline" onClick={() => void load(true)} disabled={refreshing} className="border-paper/20 bg-paper/10 text-paper hover:bg-paper/15 hover:text-paper"><RefreshCw className={refreshing ? "size-4 animate-spin" : "size-4"} />{isAr ? "تحديث" : "Refresh"}</Button>
      </div>
    </header>

    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label={isAr ? "ملخص علاقات الضيوف" : "Guest relationship summary"}>
      {[
        [isAr ? "الضيوف" : "Guests", d.profiles],
        [isAr ? "الضيوف المتكررون" : "Repeat", d.repeatGuests],
        [isAr ? "نشطون خلال 30 يومًا" : "Active 30d", d.activeGuests30d],
        [isAr ? "منقطعون 60+ يومًا" : "Lapsed 60d+", d.lapsedGuests60d],
      ].map(([label, value]) => <article key={String(label)} className="rounded-2xl border border-line bg-paper p-5"><p className="text-sm text-muted">{label}</p><p className="mt-2 font-display text-3xl font-semibold tabular">{formatNumber(Number(value))}</p></article>)}
    </section>

    <section className="grid gap-4 md:grid-cols-2" aria-label={isAr ? "قدرات علاقات الضيوف" : "Guest relationship capabilities"}>
      {cards.map((card) => <Card key={card.title} title={card.title} text={card.text} />)}
    </section>

    <section className="grid gap-3 rounded-2xl border border-line bg-paper p-5">
      <div><p className="text-xs font-semibold uppercase tracking-[.16em] text-accent">{isAr ? "ما الذي يفعله R9 فعليًا؟" : "What R9 actually does"}</p><h2 className="mt-1 font-display text-2xl font-semibold">{isAr ? "علاقة أفضل بالضيف دون أتمتة خطرة" : "Better guest relationships without unsafe automation"}</h2></div>
      <ul className="grid gap-2 text-sm leading-6 text-muted sm:grid-cols-2">
        <li className="rounded-xl bg-sand/30 p-3">{isAr ? "CRM مبني على بيانات الضيوف والطلبات الحقيقية." : "CRM derived from real guest and order data."}</li>
        <li className="rounded-xl bg-sand/30 p-3">{isAr ? "رصيد الولاء وسجل النقاط تحت تحكم المالك." : "Loyalty balance and ledger remain owner-controlled."}</li>
        <li className="rounded-xl bg-sand/30 p-3">{isAr ? "الحملات تُحفظ كمسودات ولا تُرسل تلقائيًا." : "Campaigns are drafts and are not sent automatically."}</li>
        <li className="rounded-xl bg-sand/30 p-3">{isAr ? "الاحتفاظ يصف الدليل المتاح ولا يدّعي تنبؤًا مستقبليًا." : "Retention describes available evidence without predictive claims."}</li>
      </ul>
    </section>

    <section className="rounded-2xl border border-line bg-paper p-5 text-sm text-muted">{isAr ? "متوسط قيمة الطلب المرصودة: " : "Average observed order value: "}<strong>{d.averageOrderValue.toFixed(2)} {isAr ? "ر.س" : "SAR"}</strong>. {isAr ? "كل الإشارات مشتقة من بيانات خادم محكومة بنطاق المطعم والفرع؛ لا يتم إرسال رسائل أو منح مكافآت أو تغيير الأسعار أو تعديل بيانات الضيوف تلقائيًا." : "Retention signals are derived from tenant-scoped server data; no automatic message, reward, pricing change, or guest mutation is performed."}</section>
  </div>;
}

function Card({ title, text }: { title: string; text: string }) {
  return <article className="rounded-2xl border border-line bg-paper p-6"><h2 className="font-display text-xl font-semibold">{title}</h2><p className="mt-2 text-sm leading-6 text-muted">{text}</p></article>;
}
