import Link from "next/link";
import { BhalobashaLogo } from "../common/bhalobasha-logo";

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
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
            <h4 className="font-semibold">Quick Links</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>
                <Link href="/listings" className="hover:text-primary">
                  Browse Listings
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/listings/new"
                  className="hover:text-primary"
                >
                  Post a Listing
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-primary">
                  Login
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Contact</h4>
            <p className="mt-3 text-sm text-muted">
              Dhaka, Bangladesh
              <br />
              support@bhalobasha.com
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-100 pt-6 text-center text-sm text-muted">
          © {new Date().getFullYear()} Bhalobasha. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
