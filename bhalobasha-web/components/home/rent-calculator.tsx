"use client";

import { useState } from "react";
import { Calculator, Users, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatBDT } from "@/lib/utils/format";

function parseNonNegativeAmount(value: string): number {
  const amount = Number(value);
  return Number.isFinite(amount) && amount >= 0 ? amount : 0;
}

export function RentCalculator() {
  const [rent, setRent] = useState("15000");
  const [utilities, setUtilities] = useState("3000");
  const [otherCharges, setOtherCharges] = useState("0");
  const [advance, setAdvance] = useState("15000");
  const [householdSize, setHouseholdSize] = useState("1");

  const monthlyRent = parseNonNegativeAmount(rent);
  const monthlyUtilities = parseNonNegativeAmount(utilities);
  const monthlyOtherCharges = parseNonNegativeAmount(otherCharges);
  const advanceAmount = parseNonNegativeAmount(advance);
  const people = Math.max(1, Math.floor(parseNonNegativeAmount(householdSize)));
  const monthlyTotal = monthlyRent + monthlyUtilities + monthlyOtherCharges;
  const moveInTotal = monthlyTotal + advanceAmount;

  return (
    <section className="bg-surface-muted px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-start gap-3">
          <span className="rounded-lg bg-primary-light p-2 text-primary">
            <Calculator aria-hidden="true" className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-2xl font-bold">Plan your rent</h2>
            <p className="mt-1 text-sm text-muted">
              Estimate monthly costs and how much to prepare before moving in.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardContent className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
              <div className="space-y-1.5">
                <Label htmlFor="rent-calculator-rent">Monthly rent (৳)</Label>
                <Input
                  id="rent-calculator-rent"
                  type="number"
                  min="0"
                  step="100"
                  inputMode="numeric"
                  value={rent}
                  onChange={(event) => setRent(event.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="rent-calculator-utilities">
                  Utilities per month (৳)
                </Label>
                <Input
                  id="rent-calculator-utilities"
                  type="number"
                  min="0"
                  step="100"
                  inputMode="numeric"
                  value={utilities}
                  onChange={(event) => setUtilities(event.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="rent-calculator-other">
                  Other monthly charges (৳)
                </Label>
                <Input
                  id="rent-calculator-other"
                  type="number"
                  min="0"
                  step="100"
                  inputMode="numeric"
                  value={otherCharges}
                  onChange={(event) => setOtherCharges(event.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="rent-calculator-advance">Advance (৳)</Label>
                <Input
                  id="rent-calculator-advance"
                  type="number"
                  min="0"
                  step="100"
                  inputMode="numeric"
                  value={advance}
                  onChange={(event) => setAdvance(event.target.value)}
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="rent-calculator-household">
                  People sharing the monthly costs
                </Label>
                <div className="relative sm:max-w-[calc(50%-0.5rem)]">
                  <Users
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                  />
                  <Input
                    id="rent-calculator-household"
                    className="pl-9"
                    type="number"
                    min="1"
                    max="100"
                    step="1"
                    inputMode="numeric"
                    value={householdSize}
                    onChange={(event) => setHouseholdSize(event.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary-light/40">
            <CardContent
              aria-live="polite"
              className="flex h-full flex-col justify-center p-5 sm:p-6"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-muted">
                <Wallet aria-hidden="true" className="h-4 w-4" />
                Estimated costs
              </div>
              <p className="mt-2 text-3xl font-bold text-primary">
                {formatBDT(monthlyTotal)}
                <span className="ml-1 text-sm font-normal text-muted">
                  / month
                </span>
              </p>
              <div className="mt-5 space-y-3 border-t border-border pt-4 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-muted">Your monthly share</span>
                  <span className="font-semibold">
                    {formatBDT(monthlyTotal / people)}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted">Estimated move-in total</span>
                  <span className="font-semibold">
                    {formatBDT(moveInTotal)}
                  </span>
                </div>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-muted">
                Move-in estimate includes one month of rent and charges plus
                the advance you entered. Sample figures are editable; confirm
                all charges and advance terms with the owner.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
