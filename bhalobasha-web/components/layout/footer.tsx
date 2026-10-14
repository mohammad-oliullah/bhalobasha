import Link from "next/link";
import { useTranslations } from "next-intl";
import { BhalobashaLogo } from "../common/bhalobasha-logo";

export function Footer() {
  const t = useTranslations("navigation");

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <BhalobashaLogo />
            <p className="mt-2 text-sm text-muted">
              ভালোবাসা — Bangladesh&apos;s trusted platform to find flats,
              rooms, sublets, bachelor seats, and mess accommodations.
            </p>
          </div>
          <div>
            <h4 className="font-semibold">{t("quickLinks")}</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>
                <Link href="/listings" className="hover:text-primary">
                  {t("browseListings")}
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/listings/new"
                  className="hover:text-primary"
                >
                  {t("postListing")}
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-primary">
                  {t("login")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">{t("contact")}</h4>
            <p className="mt-3 text-sm text-muted">
              Dhaka, Bangladesh
              <br />
              support@bhalobasha.com
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted">
          © {new Date().getFullYear()} Bhalobasha. {t("allRightsReserved")}
        </div>
      </div>
    </footer>
  );
}
