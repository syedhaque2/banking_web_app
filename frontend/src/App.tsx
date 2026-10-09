import { useEffect, useState, type ReactNode } from "react"

type IconName = "activity" | "arrow-down" | "arrow-up" | "chevron" | "copy" | "grid" | "plus" | "search" | "settings" | "swap" | "wallet" | "x"

type Asset = {
  name: string
  symbol: string
  amount: number
  value: number
  change: string
  color: string
  mark: string
}

type ApiAsset = Omit<Asset, "color" | "mark">

const defaultAssets: Asset[] = [
  {
    name: "Solana",
    symbol: "SOL",
    amount: 132.48,
    value: 21971.68,
    change: "+5.21%",
    color: "from-violet-500 via-fuchsia-400 to-emerald-300",
    mark: "S",
  },
  {
    name: "USD Coin",
    symbol: "USDC",
    amount: 8640,
    value: 8640,
    change: "+0.02%",
    color: "from-blue-500 to-sky-400",
    mark: "$",
  },
  {
    name: "Jupiter",
    symbol: "JUP",
    amount: 6410.32,
    value: 5320.57,
    change: "-2.18%",
    color: "from-emerald-400 to-cyan-500",
    mark: "J",
  },
  {
    name: "Render",
    symbol: "RNDR",
    amount: 832.09,
    value: 4316.62,
    change: "+8.47%",
    color: "from-red-500 to-orange-400",
    mark: "R",
  },
]

const assetStyles: Record<string, Pick<Asset, "color" | "mark">> = {
  ...Object.fromEntries(
    defaultAssets.map(({ symbol, color, mark }) => [
      symbol,
      { color, mark },
    ]),
  ),
  RAY: { color: "from-sky-500 to-blue-700", mark: "R" },
  BONK: { color: "from-orange-400 to-amber-600", mark: "B" },
  USDT: { color: "from-emerald-500 to-teal-700", mark: "T" },
}

function isApiAsset(value: unknown): value is ApiAsset {
  if (typeof value !== "object" || value === null) {
    return false
  }

  const asset = value as Record<string, unknown>
  return (
    typeof asset.name === "string" &&
    typeof asset.symbol === "string" &&
    typeof asset.amount === "number" &&
    Number.isFinite(asset.amount) &&
    typeof asset.value === "number" &&
    Number.isFinite(asset.value) &&
    typeof asset.change === "string"
  )
}

function Icon({
  name,
  className = "size-5",
}: {
  name: IconName
  className?: string
}) {
  const paths: Record<IconName, ReactNode> = {
    activity: <path d="M3 12h4l2-8 4 16 2-8h6" />,
    "arrow-down": (
      <>
        <path d="M12 3v18" />
        <path d="m18 15-6 6-6-6" />
      </>
    ),
    "arrow-up": (
      <>
        <path d="M12 21V3" />
        <path d="m6 9 6-6 6 6" />
      </>
    ),
    chevron: <path d="m9 18 6-6-6-6" />,
    copy: (
      <>
        <rect width="13" height="13" x="9" y="9" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </>
    ),
    grid: (
      <>
        <rect width="7" height="7" x="3" y="3" rx="1" />
        <rect width="7" height="7" x="14" y="3" rx="1" />
        <rect width="7" height="7" x="3" y="14" rx="1" />
        <rect width="7" height="7" x="14" y="14" rx="1" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    settings: (
      <>
        <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 8.5 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 8.5a1.7 1.7 0 0 0-.34-1.88l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3a2 2 0 1 1 4 0v.09A1.7 1.7 0 0 0 15.5 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c.13.37.34.7.6 1 .3.3.68.44 1.1.4h.1a2 2 0 1 1 0 4h-.09A1.7 1.7 0 0 0 19.4 15Z" />
      </>
    ),
    swap: (
      <>
        <path d="m16 3 4 4-4 4" />
        <path d="M4 7h16" />
        <path d="m8 21-4-4 4-4" />
        <path d="M20 17H4" />
      </>
    ),
    wallet: (
      <>
        <path d="M20 7V6a2 2 0 0 0-2-2H5a3 3 0 0 0 0 6h15v8a2 2 0 0 1-2 2H5a3 3 0 0 1-3-3V7" />
        <path d="M16 14h.01" />
      </>
    ),
    x: (
      <>
        <path d="m18 6-12 12" />
        <path d="m6 6 12 12" />
      </>
    ),
  }

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}

function Button({
  children,
  className = "",
  onClick,
  type = "button",
}: {
  children: ReactNode
  className?: string
  onClick?: () => void
  type?: "button" | "submit"
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${className}`}
    >
      {children}
    </button>
  )
}

function Chart({ currency }: { currency: "USD" | "SOL" }) {
  return (
    <div className="relative mt-7 h-64 w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between pb-7">
        {[0, 1, 2, 3].map((line) => (
          <div key={line} className="border-t border-slate-200/70" />
        ))}
      </div>
      <svg
        viewBox="0 0 900 255"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        aria-label="Portfolio value increased over the selected month"
      >
        <defs>
          <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--chart)" stopOpacity=".22" />
            <stop offset="100%" stopColor="var(--chart)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="line" x1="0" x2="1">
            <stop offset="0%" stopColor="var(--chart-soft)" />
            <stop offset="100%" stopColor="var(--chart)" />
          </linearGradient>
        </defs>
        <path
          d="M0 198 C55 194 71 172 118 179 S179 201 222 172 S290 159 326 167 S380 131 424 144 S489 166 528 123 S591 119 627 90 S692 111 735 74 S792 61 826 68 S870 31 900 42 L900 255 L0 255Z"
          fill="url(#area)"
        />
        <path
          d="M0 198 C55 194 71 172 118 179 S179 201 222 172 S290 159 326 167 S380 131 424 144 S489 166 528 123 S591 119 627 90 S692 111 735 74 S792 61 826 68 S870 31 900 42"
          fill="none"
          stroke="url(#line)"
          strokeWidth="3"
          vectorEffect="non-scaling-stroke"
        />
        <circle
          cx="900"
          cy="42"
          r="6"
          fill="var(--surface)"
          stroke="var(--chart)"
          strokeWidth="3"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="absolute right-3 top-4 rounded-lg bg-slate-950 px-3 py-2 text-xs font-semibold text-white shadow-lg">
        {currency === "USD" ? "$48,240" : "290.87 SOL"}
      </div>
      <div className="absolute inset-x-0 bottom-0 flex justify-between text-xs font-medium text-slate-400">
        <span>May 01</span>
        <span>May 08</span>
        <span>May 15</span>
        <span>May 22</span>
        <span>Today</span>
      </div>
    </div>
  )
}

function TransactionModal({ onClose }: { onClose: () => void }) {
  const [sent, setSent] = useState(false)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Send transaction"
    >
      <div className="w-full max-w-md rounded-3xl border border-white/60 bg-white p-6 shadow-2xl">
        {sent ? (
          <div className="flex flex-col items-center py-8 text-center">
            <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <Icon name="arrow-up" className="size-7" />
            </div>
            <div className="text-2xl font-semibold tracking-tight text-slate-950">
              Transaction initiated
            </div>
            <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
              Your transaction was submitted to the Solana network and is
              awaiting confirmation.
            </p>
            <Button
              onClick={onClose}
              className="mt-7 w-full rounded-xl bg-slate-950 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Done
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-semibold tracking-tight text-slate-950">
                  Send assets
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  Initiate a Solana transaction
                </p>
              </div>
              <Button
                onClick={onClose}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <Icon name="x" />
              </Button>
            </div>
            <form
              className="mt-7 space-y-5"
              onSubmit={(event) => {
                event.preventDefault()
                setSent(true)
              }}
            >
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Asset
                </span>
                <select className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-indigo-500">
                  <option>Solana (SOL)</option>
                  <option>USD Coin (USDC)</option>
                  <option>Jupiter (JUP)</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Recipient address
                </span>
                <input
                  required
                  placeholder="Solana wallet address"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Amount
                </span>
                <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-4 focus-within:border-indigo-500">
                  <input
                    required
                    type="number"
                    min="0"
                    step="any"
                    placeholder="0.00"
                    className="min-w-0 flex-1 bg-transparent py-3 text-lg font-semibold text-slate-950 outline-none placeholder:text-slate-300"
                  />
                  <span className="text-sm font-semibold text-slate-500">
                    SOL
                  </span>
                </div>
              </label>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm">
                <span className="text-slate-500">Network fee</span>
                <span className="font-semibold text-slate-800">
                  ~0.000005 SOL
                </span>
              </div>
              <Button
                type="submit"
                className="w-full rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700"
              >
                Review transaction
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default function App() {
  const [assets, setAssets] = useState<Asset[]>(defaultAssets)
  const [currency, setCurrency] = useState<"USD" | "SOL">("USD")
  const [range, setRange] = useState("1M")
  const [modalOpen, setModalOpen] = useState(false)
  const [walletAddress, setWalletAddress] = useState("Loading wallet...")

  useEffect(() => {
    fetch("/api/tokens")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Wallet API request failed with status ${res.status}.`)
        }
        return res.json()
      })
      .then((data: unknown) => {
        if (!Array.isArray(data) || !data.every(isApiAsset)) {
          throw new Error("Wallet API returned an invalid asset list.")
        }

        setAssets(
          data.map((asset) => ({
            ...asset,
            color:
              assetStyles[asset.symbol]?.color ??
              "from-slate-500 to-slate-700",
            mark: assetStyles[asset.symbol]?.mark ?? asset.symbol.slice(0, 1),
          })),
        )
      })
      .catch((error: unknown) => {
        console.error("Failed to load wallet assets from the API.", error)
        setAssets(defaultAssets)
      })

    fetch("/api/wallet")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Wallet address request failed with status ${res.status}.`)
        }
        return res.json()
      })
      .then((data: unknown) => {
        const address =
          typeof data === "string"
            ? data
            : typeof data === "object" && data !== null
              ? (data as Record<string, unknown>).wallet_address ??
                (data as Record<string, unknown>).walletAddress
              : undefined

        if (typeof address !== "string") {
          throw new Error("Wallet API returned an invalid wallet address.")
        }

        setWalletAddress(address)
      })
      .catch((error: unknown) => {
        console.error("Failed to load wallet address from the API.", error)
        setWalletAddress("Wallet unavailable")
      })
  }, [])

  const usdTotal = assets.reduce((total, asset) => total + asset.value, 0)
  const solAsset = assets.find((asset) => asset.symbol === "SOL")
  const solPrice =
    solAsset && solAsset.amount > 0 ? solAsset.value / solAsset.amount : 165.85
  const total =
    currency === "USD"
      ? `$${usdTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
      : `${(usdTotal / solPrice).toFixed(2)} SOL`
  return (
    <div className="min-h-screen bg-slate-100 p-3 text-slate-950 sm:p-5 lg:p-7">
      <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-screen-2xl overflow-hidden rounded-3xl border border-white/80 bg-[var(--surface)] shadow-xl shadow-slate-300/40">
        <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200/80 bg-white p-5 lg:flex">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-slate-950 text-white">
              <Icon name="activity" />
            </div>
            <div className="text-lg font-bold tracking-tight">Vertex</div>
          </div>
          <div className="mt-10 space-y-1">
            <Button className="flex w-full items-center gap-3 rounded-xl bg-indigo-50 px-3 py-3 text-sm font-semibold text-indigo-700">
              <Icon name="grid" />
              Portfolio
            </Button>
            <Button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900">
              <Icon name="wallet" />
              Wallets
            </Button>
            <Button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900">
              <Icon name="swap" />
              Activity
            </Button>
          </div>
          <div className="mt-auto">
            <div className="mb-5 rounded-2xl bg-slate-950 p-4 text-white">
              <div className="flex size-8 items-center justify-center rounded-lg bg-white/10">
                <Icon name="plus" className="size-4" />
              </div>
              <div className="mt-5 text-sm font-semibold">
                Add another wallet
              </div>
              <div className="mt-1 text-xs leading-5 text-slate-400">
                Track all your assets in one place.
              </div>
            </div>
            <Button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900">
              <Icon name="settings" />
              Settings
            </Button>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="flex h-20 items-center justify-between border-b border-slate-200/80 px-5 sm:px-8">
            <div className="flex items-center gap-3 lg:hidden">
              <div className="flex size-9 items-center justify-center rounded-xl bg-slate-950 text-white">
                <Icon name="activity" />
              </div>
              <span className="font-bold">Vertex</span>
            </div>
            <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-400 sm:flex">
              <Icon name="search" className="size-4" />
              <input
                className="w-48 bg-transparent text-sm outline-none placeholder:text-slate-400"
                placeholder="Search assets"
                aria-label="Search assets"
              />
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-400">
                ⌘ K
              </span>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <div className="hidden items-center rounded-lg bg-slate-100 p-1 sm:flex">
                {(["USD", "SOL"] as const).map((item) => (
                  <Button
                    key={item}
                    onClick={() => setCurrency(item)}
                    className={`rounded-md px-3 py-1.5 text-xs font-semibold ${
                      currency === item
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-400 hover:text-slate-700"
                    }`}
                  >
                    {item}
                  </Button>
                ))}
              </div>
              <Button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                <span className="size-2 rounded-full bg-emerald-500" />
                {walletAddress}
                <Icon name="chevron" className="size-3 rotate-90" />
              </Button>
            </div>
          </header>

          <div className="p-5 sm:p-8">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <div className="text-sm font-medium text-slate-500">
                  Total portfolio value
                </div>
                <div className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
                  {total}
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm">
                  <span className="rounded-md bg-emerald-100 px-2 py-1 font-semibold text-emerald-700">
                    +4.38%
                  </span>
                  <span className="text-slate-400">+$2,018.42 this month</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  <Icon name="arrow-down" className="size-4" />
                  Receive
                </Button>
                <Button
                  onClick={() => setModalOpen(true)}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700"
                >
                  <Icon name="arrow-up" className="size-4" />
                  Send
                </Button>
              </div>
            </div>

            <section className="mt-8 rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">Portfolio performance</div>
                  <div className="mt-1 text-xs text-slate-400">
                    Your wallet value over time
                  </div>
                </div>
                <div className="flex rounded-lg bg-slate-100 p-1">
                  {["1D", "1W", "1M", "1Y"].map((item) => (
                    <Button
                      key={item}
                      onClick={() => setRange(item)}
                      className={`rounded-md px-2.5 py-1.5 text-xs font-semibold ${
                        range === item
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-400 hover:text-slate-700"
                      }`}
                    >
                      {item}
                    </Button>
                  ))}
                </div>
              </div>
              <Chart currency={currency} />
            </section>

            <section className="mt-8">
              <div className="mb-4 flex items-end justify-between">
                <div>
                  <div className="text-lg font-semibold">Your assets</div>
                  <div className="mt-1 text-sm text-slate-400">
                    {assets.length} assets in this wallet
                  </div>
                </div>
                <Button className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">
                  Manage assets
                </Button>
              </div>
              <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
                <div className="hidden grid-cols-[1.5fr_1fr_1fr_1fr_auto] gap-4 border-b border-slate-100 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 md:grid">
                  <span>Asset</span>
                  <span>Balance</span>
                  <span>Price</span>
                  <span>24h</span>
                  <span className="w-5" />
                </div>
                {assets.map((asset) => (
                  <div
                    key={asset.symbol}
                    className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-slate-100 px-4 py-4 last:border-0 hover:bg-slate-50/70 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr_1fr_auto]"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex size-10 items-center justify-center rounded-full bg-gradient-to-br ${asset.color} text-sm font-bold text-white shadow-sm`}
                      >
                        {asset.mark}
                      </div>
                      <div>
                        <div className="text-sm font-semibold">
                          {asset.name}
                        </div>
                        <div className="mt-0.5 text-xs font-medium text-slate-400">
                          {asset.symbol}
                        </div>
                      </div>
                    </div>
                    <div className="hidden md:block">
                      <div className="text-sm font-semibold">
                        {asset.amount.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 8,
                        })}
                      </div>
                      <div className="mt-0.5 text-xs text-slate-400">
                        {asset.symbol}
                      </div>
                    </div>
                    <div className="hidden text-sm font-medium md:block">
                      $
                      {(
                        asset.amount > 0 ? asset.value / asset.amount : 0
                      ).toFixed(2)}
                    </div>
                    <div
                      className={`hidden text-sm font-semibold md:block ${
                        asset.change.startsWith("+")
                          ? "text-emerald-600"
                          : "text-rose-500"
                      }`}
                    >
                      {asset.change}
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold md:hidden">
                        $
                        {asset.value.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                      <Button className="hidden rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 md:block">
                        <Icon name="chevron" className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
      {modalOpen && <TransactionModal onClose={() => setModalOpen(false)} />}
    </div>
  )
}
