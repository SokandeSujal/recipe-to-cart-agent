"use client";

import {
  ArrowRight,
  Bookmark,
  CheckCircle,
  ChefHat,
  Clock,
  FileText,
  PackageCheck,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Tag,
  Trash2,
  Users,
  Video,
  WandSparkles,
  MapPin,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { MockModeBanner } from "@/components/shared/mock-mode-banner";
import { SHOW_MARKETING_SECTIONS } from "@/lib/config/ui";
import {
  getCartItemKey,
  useCart,
  type DeliveryAddress,
} from "@/contexts/cart-context";
import type { GeneratedCart } from "@/types/cart";
import type { ExtractedRecipe } from "@/types/recipe";

const sourceTabs = [
  { id: "text", label: "Paste Text", icon: FileText },
  { id: "youtube", label: "YouTube Link", icon: Video },
];

const howItWorks = [
  {
    title: "Add Recipe",
    text: "Paste text or a YouTube recipe link",
    icon: FileText,
    color: "bg-emerald-500",
  },
  {
    title: "AI Extracts",
    text: "Gemini AI extracts ingredients and quantities",
    icon: WandSparkles,
    color: "bg-orange-500",
  },
  {
    title: "Select Servings",
    text: "Choose how many people you are cooking for",
    icon: Users,
    color: "bg-violet-600",
  },
  {
    title: "Smart Cart",
    text: "Get optimized items with best pack sizes",
    icon: ShoppingCart,
    color: "bg-blue-600",
  },
  {
    title: "Order Instantly",
    text: "Review, confirm, and place order on Instamart",
    icon: CheckCircle,
    color: "bg-emerald-600",
  },
];

const popularRecipes = [
  {
    title: "Veg Sandwich",
    time: "10 mins",
    level: "Easy",
    image:
      "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=520&q=80",
  },
  {
    title: "Pasta in White Sauce",
    time: "30 mins",
    level: "Medium",
    image:
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=520&q=80",
  },
  {
    title: "Paneer Butter Masala",
    time: "40 mins",
    level: "Medium",
    image:
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=520&q=80",
  },
  {
    title: "Chole Bhature",
    time: "45 mins",
    level: "Easy",
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=520&q=80",
  },
  {
    title: "Chocolate Pancakes",
    time: "20 mins",
    level: "Easy",
    image:
      "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=520&q=80",
  },
];

const featureBadges = [
  {
    title: "Powered by Gemini AI",
    text: "Advanced recipe understanding",
    icon: Sparkles,
  },
  {
    title: "Smart Pack Selection",
    text: "Best size for your serving",
    icon: PackageCheck,
  },
  {
    title: "Real-time Instamart Data",
    text: "Live prices and availability",
    icon: Tag,
  },
  {
    title: "Secure & Private",
    text: "Your data is always safe",
    icon: ShieldCheck,
  },
];

export default function HomePage() {
  const smokeRecipe =
    "Serves 2. Make vegetable sandwich with 4 bread slices, 100 g butter, 1 cucumber, 2 tomatoes, 1 onion, and 100 g cheese.";
  const smokeYouTubeUrl = "https://www.youtube.com/watch?v=4QcK3MXl9sg";
  const [recipeText, setRecipeText] = useState("");
  const [source, setSource] = useState("text");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const {
    cart,
    recipe,
    servings,
    setCart,
    setRecipe,
    setServings,
    removeCartItem,
  } = useCart();
  const [loading, setLoading] = useState<"extract" | "cart" | null>(null);
  const [error, setError] = useState("");
  const smokeStarted = useRef(false);

  const buildCart = useCallback(
    async (nextRecipe: ExtractedRecipe, nextServings: number) => {
      setLoading("cart");
      setError("");

      try {
        const response = await fetch("/api/cart/build", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ recipe: nextRecipe, servings: nextServings }),
        });
        const data = (await response.json()) as {
          cart?: GeneratedCart;
          error?: string;
        };

        if (!response.ok || !data.cart) {
          throw new Error(data.error || "Cart build failed.");
        }

        setCart(data.cart);
      } catch (caught) {
        setError(
          caught instanceof Error ? caught.message : "Cart build failed.",
        );
      } finally {
        setLoading(null);
      }
    },
    [setCart],
  );

  async function extractIngredients() {
    setError("");
    setLoading("extract");
    setCart(null);

    try {
      const response = await fetch(
        source === "youtube" ? "/api/ingest/youtube" : "/api/extract",
        {
        method: "POST",
        headers: { "content-type": "application/json" },
          body: JSON.stringify(
            source === "youtube" ? { url: youtubeUrl } : { recipeText },
          ),
        },
      );
      const data = (await response.json()) as {
        recipe?: ExtractedRecipe;
        error?: string;
      };

      if (!response.ok || !data.recipe) {
        throw new Error(data.error || "Ingredient extraction failed.");
      }

      setRecipe(data.recipe);
      setServings(1);
      await buildCart(data.recipe, 1);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Ingredient extraction failed.");
    } finally {
      setLoading((current) => (current === "extract" ? null : current));
    }
  }

  useEffect(() => {
    const nextSmokeSource = new URLSearchParams(window.location.search).get(
      "smoke",
    );

    if (smokeStarted.current || !["1", "youtube"].includes(nextSmokeSource ?? "")) {
      return;
    }

    smokeStarted.current = true;
    const isYouTubeSmoke = nextSmokeSource === "youtube";
    setSource(isYouTubeSmoke ? "youtube" : "text");
    setRecipeText(isYouTubeSmoke ? "" : smokeRecipe);
    setYoutubeUrl(isYouTubeSmoke ? smokeYouTubeUrl : "");

    fetch(isYouTubeSmoke ? "/api/ingest/youtube" : "/api/extract", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(
        isYouTubeSmoke
          ? { url: smokeYouTubeUrl }
          : { recipeText: smokeRecipe },
      ),
    })
      .then((response) => response.json().then((data) => ({ response, data })))
      .then(
        ({
          response,
          data,
        }: {
          response: Response;
          data: { recipe?: ExtractedRecipe; error?: string };
        }) => {
          if (!response.ok || !data.recipe) {
            throw new Error(data.error || "Ingredient extraction failed.");
          }

          setRecipe(data.recipe);
          setServings(1);
          return buildCart(data.recipe, 1);
        },
      )
      .catch((caught) => {
        setError(
          caught instanceof Error ? caught.message : "Smoke test failed.",
        );
      });
  }, [buildCart, setRecipe, setServings, smokeRecipe, smokeYouTubeUrl]);

  function updateServings(nextServings: number) {
    setServings(nextServings);

    if (!recipe) {
      return;
    }

    void buildCart(recipe, nextServings);
  }

  return (
    <section className="space-y-4">
      <header className="px-1">
        <h1 className="text-[34px] font-bold leading-tight tracking-tight text-slate-950 sm:text-[40px]">
          Hey Sujal!
        </h1>
        <p className="mt-2 text-sm font-medium text-slate-600 sm:text-base">
          Turn any recipe into a smart shopping cart in seconds.
        </p>
      </header>

      <RecipeInputCard
        source={source}
        setSource={setSource}
        recipeText={recipeText}
        setRecipeText={setRecipeText}
        youtubeUrl={youtubeUrl}
        setYoutubeUrl={setYoutubeUrl}
        onExtract={extractIngredients}
        loading={loading === "extract"}
      />
      <ExtractionAndCartPanel
        recipe={recipe}
        servings={servings}
        setServings={updateServings}
        cart={cart}
        loading={loading === "cart"}
        error={error}
        removeCartItem={removeCartItem}
      />
      {SHOW_MARKETING_SECTIONS ? (
        <>
          <PopularRecipes />
          <HowItWorks />
          <FeatureBadges />
        </>
      ) : null}
    </section>
  );
}

export function AddressSelectionPanel({
  selectedAddress,
  setSelectedAddress,
}: {
  selectedAddress: DeliveryAddress | null;
  setSelectedAddress: (address: DeliveryAddress | null) => void;
}) {
  const [addresses, setAddresses] = useState<DeliveryAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    fetch("/api/instamart/addresses", { cache: "no-store" })
      .then((response) => response.json())
      .then(
        (data: {
          addresses?: DeliveryAddress[];
          error?: string;
          mode?: "real" | "mock";
        }) => {
          if (!mounted) {
            return;
          }

          setAddresses(data.addresses ?? []);
          setError(data.error ?? "");
          if (!selectedAddress && data.addresses?.length) {
            setSelectedAddress(data.addresses[0]);
          }
        },
      )
      .catch((caught) => {
        if (mounted) {
          setError(
            caught instanceof Error
              ? caught.message
              : "Could not load Instamart addresses.",
          );
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [selectedAddress, setSelectedAddress]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-950">
            Delivery address
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Select an existing Instamart address. No address changes are made.
          </p>
        </div>
        <MapPin className="text-[#fc4c02]" size={24} strokeWidth={1.8} />
      </div>

      {loading ? (
        <p className="mt-4 text-sm font-medium text-slate-500">
          Loading saved addresses...
        </p>
      ) : null}
      {error ? (
        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800">
          {error}
        </p>
      ) : null}

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {addresses.map((address) => {
          const selected = selectedAddress?.id === address.id;

          return (
            <button
              key={address.id}
              type="button"
              onClick={() => setSelectedAddress(address)}
              className={[
                "rounded-xl border p-4 text-left transition",
                selected
                  ? "border-emerald-300 bg-emerald-50"
                  : "border-slate-200 bg-white hover:bg-slate-50",
              ].join(" ")}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-bold text-slate-950">
                  {address.addressTag || address.addressCategory || "Address"}
                </span>
                {selected ? (
                  <span className="rounded-full bg-emerald-600 px-2 py-1 text-[11px] font-bold text-white">
                    Selected
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {address.addressLine}
              </p>
              {address.phoneNumber ? (
                <p className="mt-2 text-xs font-medium text-slate-500">
                  Phone {address.phoneNumber}
                </p>
              ) : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function RecipeInputCard({
  source,
  setSource,
  recipeText,
  setRecipeText,
  youtubeUrl,
  setYoutubeUrl,
  onExtract,
  loading,
}: {
  source: string;
  setSource: (value: string) => void;
  recipeText: string;
  setRecipeText: (value: string) => void;
  youtubeUrl: string;
  setYoutubeUrl: (value: string) => void;
  onExtract: () => void;
  loading: boolean;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_190px]">
        <div className="min-w-0">
          <h2 className="text-xl font-bold text-slate-950">
            Add your recipe from anywhere
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Paste text or a YouTube link to extract ingredients with AI
          </p>

          <div className="mt-6 flex flex-wrap gap-2 border-b border-slate-200">
            {sourceTabs.map((tab) => {
              const Icon = tab.icon;

              return (
                <button
                  key={tab.label}
                  type="button"
                  className={[
                    "flex items-center gap-2 border-b-2 px-3 py-3 text-sm font-semibold transition sm:px-4",
                    source === tab.id
                      ? "border-[#fc4c02] text-[#fc4c02]"
                      : "border-transparent text-slate-800 hover:text-slate-950",
                  ].join(" ")}
                  onClick={() => setSource(tab.id)}
                >
                  <Icon size={18} strokeWidth={1.9} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="mt-0 rounded-b-xl rounded-tr-xl border border-t-0 border-slate-200 bg-white p-4 sm:p-5">
            <div className="flex min-h-[132px] flex-col justify-between gap-5">
              <div>
                {source === "youtube" ? (
                  <input
                    value={youtubeUrl}
                    onChange={(event) => setYoutubeUrl(event.target.value)}
                    className="w-full border-0 bg-transparent text-base font-medium text-slate-800 placeholder:text-slate-500 focus:outline-none"
                    placeholder="Paste a YouTube recipe URL..."
                  />
                ) : (
                  <textarea
                    value={recipeText}
                    onChange={(event) => setRecipeText(event.target.value)}
                    rows={4}
                    className="min-h-24 w-full resize-none border-0 bg-transparent text-base font-medium text-slate-800 placeholder:text-slate-500 focus:outline-none"
                    placeholder="Paste your recipe here..."
                  />
                )}
                <p className="mt-2 text-sm text-slate-500">
                  {source === "youtube"
                    ? "Only structured ingredients are shown. Raw transcripts stay server-side."
                    : "Example: 2 cups flour, 1 cup sugar, 3 eggs, 1 tsp baking powder..."}
                </p>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onExtract}
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#fc4c02] px-4 py-3 text-sm font-bold text-white shadow-sm shadow-orange-200 transition hover:bg-[#e64502]"
                >
                  {loading ? "Extracting..." : "Extract Ingredients"}
                  <WandSparkles size={18} strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden items-center justify-center xl:flex">
          <div className="relative flex h-44 w-44 items-center justify-center rounded-full bg-violet-100">
            <div className="absolute bottom-8 h-9 w-24 rounded-b-full border-2 border-violet-600 border-t-0" />
            <div className="absolute bottom-12 h-8 w-28 rounded-[50%] border-2 border-violet-600" />
            <div className="relative h-28 w-20 rotate-2 rounded-lg border-2 border-violet-600 bg-white shadow-sm">
              <div className="absolute left-4 top-5 h-0.5 w-11 bg-violet-500" />
              <div className="absolute left-4 top-9 h-0.5 w-12 bg-violet-500" />
              <div className="absolute left-4 top-[52px] h-0.5 w-10 bg-violet-500" />
              <div className="absolute left-4 top-[68px] h-0.5 w-[52px] bg-violet-500" />
              <div className="absolute left-4 top-[84px] h-0.5 w-9 bg-violet-500" />
            </div>
            <div className="absolute bottom-5 right-0 flex h-14 w-14 items-center justify-center rounded-full border border-violet-300 bg-white text-violet-700 shadow-sm">
              <WandSparkles size={26} strokeWidth={1.8} />
            </div>
            <div className="absolute bottom-0 rounded-lg bg-violet-600 px-4 py-2 text-xs font-bold text-white shadow-sm">
              AI Extract
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ExtractionAndCartPanel({
  recipe,
  servings,
  setServings,
  cart,
  loading,
  error,
  removeCartItem,
}: {
  recipe: ExtractedRecipe | null;
  servings: number;
  setServings: (value: number) => void;
  cart: GeneratedCart | null;
  loading: boolean;
  error: string;
  removeCartItem: (key: string) => void;
}) {
  if (!recipe && !error) {
    return null;
  }

  return (
    <section className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[1fr_1fr]">
      <div>
        <h2 className="text-lg font-bold text-slate-950">Extracted ingredients</h2>
        {error ? (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        ) : null}
        {recipe ? (
          <>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-slate-600">Servings</span>
              <button
                type="button"
                onClick={() => setServings(Math.max(1, servings - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200"
              >
                -
              </button>
              <span className="min-w-8 text-center text-base font-bold text-slate-950">
                {servings}
              </span>
              <button
                type="button"
                onClick={() => setServings(servings + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200"
              >
                +
              </button>
              <span className="text-xs text-slate-500">
                Base recipe serves {recipe.baseServings}
              </span>
            </div>
            <div className="mt-4 grid gap-2">
              {recipe.ingredients.map((ingredient) => (
                <div
                  key={`${ingredient.name}-${ingredient.unit}`}
                  className="flex justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm"
                >
                  <span className="font-semibold text-slate-900">{ingredient.name}</span>
                  <span className="text-slate-600">
                    {ingredient.quantity} {ingredient.unit}
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : null}
      </div>

      <div>
        <h2 className="text-lg font-bold text-slate-950">Generated smart cart</h2>
        <MockModeBanner compact />
        {loading ? (
          <p className="mt-4 text-sm font-medium text-slate-600">Recalculating cart...</p>
        ) : null}
        {cart ? (
          <div className="mt-4 space-y-2">
            <div
              className={[
                "rounded-lg px-3 py-2 text-xs font-bold",
                cart.mode === "real"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-800",
              ].join(" ")}
            >
              Cart source:{" "}
              {cart.mode === "real"
                ? "Real Instamart MCP data"
                : "Mock Instamart fallback"}
            </div>
            {cart.items.map((item) => (
              <div
                key={getCartItemKey(item)}
                className="rounded-lg border border-slate-200 px-3 py-2"
              >
                <div className="flex justify-between gap-3 text-sm">
                  <span className="font-semibold text-slate-950">
                    {item.product.name}
                  </span>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="font-bold text-slate-950">
                      Rs {item.product.price * item.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label={`Remove ${item.ingredient.name}`}
                      onClick={() => removeCartItem(getCartItemKey(item))}
                      className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={15} strokeWidth={1.9} />
                    </button>
                  </div>
                </div>
                <p className="mt-1 text-xs text-slate-600">
                  {item.matchStatus === "needs_review"
                    ? item.matchReason || "No confident Instamart match."
                    : `${item.quantity} x ${item.product.displaySize} for ${
                        Math.round(item.requiredQuantity * 10) / 10
                      } ${item.requiredUnit}`}
                </p>
                {item.matchStatus === "needs_review" ? (
                  <span className="mt-2 inline-flex rounded-full bg-amber-50 px-2 py-1 text-[11px] font-bold text-amber-800">
                    Needs review
                  </span>
                ) : null}
              </div>
            ))}
            <div className="flex justify-between border-t border-slate-200 pt-3 text-sm font-bold text-slate-950">
              <span>Total</span>
              <span>Rs {cart.total}</span>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold uppercase tracking-[0.08em] text-slate-500">
          How it works
        </h2>
        <p className="hidden text-xs text-slate-500 sm:block">
          From recipe text to reviewed cart
        </p>
      </div>
      <div className="mt-3 grid gap-2 md:grid-cols-5">
        {howItWorks.map((step, index) => {
          const Icon = step.icon;

          return (
            <div key={step.title} className="relative">
              <div className="h-full rounded-lg border border-slate-200 bg-slate-50/60 p-3">
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full ${step.color} text-[11px] font-bold text-white`}
                >
                  {index + 1}
                </div>
                <div className="mt-2 flex items-start gap-2">
                  <Icon
                    className="shrink-0 text-slate-900"
                    size={18}
                    strokeWidth={1.8}
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-950">
                      {step.title}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-4 text-slate-500">
                      {step.text}
                    </p>
                  </div>
                </div>
              </div>
              {index < howItWorks.length - 1 ? (
                <ArrowRight
                  className="absolute -right-3 top-1/2 z-[1] hidden -translate-y-1/2 bg-white text-slate-700 xl:block"
                  size={16}
                  strokeWidth={1.8}
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function PopularRecipes() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-base font-bold text-slate-950">
          Try these popular recipes
        </h2>
        <button
          type="button"
          className="inline-flex items-center gap-2 text-sm font-semibold text-violet-700"
        >
          View all recipes
          <ArrowRight size={17} strokeWidth={1.9} />
        </button>
      </div>
      <div className="mt-3">
        <MockModeBanner compact />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {popularRecipes.map((recipe) => (
          <article
            key={recipe.title}
            className="overflow-hidden rounded-xl border border-slate-200 bg-white"
          >
            <div className="relative aspect-[1.75] overflow-hidden bg-slate-100">
              <div
                aria-hidden="true"
                className="h-full w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${recipe.image})` }}
              />
              <button
                type="button"
                aria-label={`Save ${recipe.title}`}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-sm"
              >
                <Bookmark size={18} strokeWidth={1.9} />
              </button>
            </div>
            <div className="p-3">
              <h3 className="text-sm font-bold leading-5 text-slate-950">
                {recipe.title}
              </h3>
              <p className="mt-2 flex items-center gap-2 text-xs text-slate-600">
                <Clock size={13} strokeWidth={1.8} />
                {recipe.time}
                <span aria-hidden="true">-</span>
                <ChefHat size={13} strokeWidth={1.8} />
                {recipe.level}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function FeatureBadges() {
  return (
    <section className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
      {featureBadges.map((feature) => {
        const Icon = feature.icon;

        return (
          <div
            key={feature.title}
            className="flex items-center gap-3 border-slate-200 lg:border-r lg:last:border-r-0"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-300 text-slate-950">
              <Icon size={22} strokeWidth={1.8} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold leading-5 text-slate-950">
                {feature.title}
              </p>
              <p className="mt-1 text-xs text-slate-600">{feature.text}</p>
            </div>
          </div>
        );
      })}
    </section>
  );
}
