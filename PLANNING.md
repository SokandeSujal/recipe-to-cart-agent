# RecipeCart Planning

Stage 0 planning for RecipeCart, a Next.js app that turns recipe input into an optimized Instamart cart through Gemini extraction and Swiggy MCP commerce tools.

## Routes

- `/`: Home dashboard. Primary recipe input, extraction entry points, how-it-works strip, popular recipe suggestions, and persistent cart panel.
- `/recipes`: Saved recipes library. Shows previously extracted recipes, serving defaults, source type, and ability to rebuild a cart.
- `/recipes/[id]`: Recipe detail. Shows extracted ingredients, serving controls, matched Instamart products, and cart rebuild actions.
- `/carts`: Saved carts and recent generated carts.
- `/carts/[id]`: Cart detail. Shows matched items, quantities, bill estimate, and checkout status.
- `/orders`: Order history. Shows mocked or real Swiggy order outcomes and status.
- `/favorites`: Favorite recipes and favorite Instamart products.
- `/price-tracker`: Ingredient/product price watcher using stored matched products and recent mock or MCP prices.
- `/youtube-library`: YouTube recipe ingestion history and saved video recipe outputs.
- `/settings`: API mode, account preferences, default address placeholder, budget defaults, and safety settings.
- `/help`: Help and support content for mock mode, MCP authentication, checkout safety, and data handling.
- `/feedback`: Feedback form placeholder for local/demo builds.
- `/checkout/confirm`: Mandatory confirmation step before any checkout call. Displays COD-only and no-cancellation warnings.
- `/checkout/result`: Success or failure result after mocked or real Swiggy MCP checkout.
- `/api/extract`: Server route for Gemini recipe extraction from pasted recipe text.
- `/api/ingest/youtube`: Server route for YouTube transcript ingestion and extraction.
- `/api/ingest/instagram`: Server route for Instagram caption/link text extraction.
- `/api/cart/build`: Server route that scales ingredients, searches Instamart, and returns product matches.
- `/api/checkout`: Server route that places the real or mocked Swiggy order only after confirmation.
- `/api/mcp/auth/[server]`: Starts OAuth for a selected Swiggy MCP server.
- `/api/mcp/callback`: Local OAuth callback for Swiggy MCP token exchange.
- `/api/mcp/status`: Reports real vs mock mode and per-server auth state.

## Component Tree

### Layout

- `AppShell`: Root authenticated dashboard shell with sidebar, topbar, main area, and cart aside.
- `Sidebar`: Navigation, RecipeCart branding, and Builders Club info card.
- `SidebarNavItem`: Single sidebar navigation row with a lucide icon and active state.
- `BuildersClubCard`: Informational card for Swiggy MCP access and local/mock mode context.
- `Topbar`: Greeting, API usage pill, notification button, and user menu.
- `ApiUsagePill`: Displays Gemini/MCP usage estimate or placeholder credits.
- `UserMenuButton`: Avatar and account menu trigger.
- `MobileShellHeader`: Compact mobile header with nav and cart toggles.
- `PageHeader`: Reusable route heading and short description.

### Recipe Input

- `RecipeInputCard`: Main input card containing source tabs and active input panel.
- `RecipeSourceTabs`: Paste Text, YouTube Link, Instagram Link, and Upload File tabs.
- `PasteRecipePanel`: Textarea input and extract action.
- `YouTubeRecipePanel`: URL input and transcript ingestion action.
- `InstagramRecipePanel`: Caption/link input and extract action.
- `UploadRecipePanel`: File picker for plain text or supported recipe document input.
- `ExtractButton`: Primary orange action button with loading state.
- `RecipeIllustrationPanel`: Right-side document/bowl visual using lucide-style line art or simple CSS shapes.
- `PopularRecipesSection`: Horizontal recipe card grid from mock data.
- `PopularRecipeCard`: Image, title, time, difficulty, and favorite action.
- `HowItWorksStrip`: Five-step process strip.
- `HowItWorksStep`: Step number, icon, title, and compact description.

### Extraction

- `ExtractionStatusPanel`: Loading, empty, error, and success states for extraction.
- `IngredientReviewList`: Editable list of extracted ingredient rows.
- `IngredientRow`: Ingredient name, quantity, unit, notes, and remove action.
- `ServingSelector`: Serving count controls and base-serving comparison.
- `SourceBadge`: Shows text, YouTube, Instagram, or upload source.
- `ExtractionJsonDebugPanel`: Development-only structured output viewer.

### Cart

- `CartPanel`: Persistent right rail with item list, totals, and checkout action.
- `CartHeader`: Cart title, item count, and mode indicator.
- `CartItemRow`: Product image, product name, pack size, price, and quantity stepper.
- `QuantityStepper`: Decrement, value, and increment controls.
- `PriceBreakdown`: Item total, delivery fee, handling fee, discounts, and final amount.
- `CheckoutDisclosure`: COD-only and no-cancellation warning copy.
- `MockModeBanner`: Visible indicator when real Swiggy MCP credentials or auth are unavailable.
- `CartEmptyState`: Empty cart state with a prompt to add a recipe.
- `CartMatchWarning`: Shows unavailable or low-confidence ingredient matches.

### Checkout

- `CheckoutConfirmDialog`: Mandatory confirmation before calling checkout.
- `CheckoutConfirmPage`: Full-page checkout review and safety warning.
- `CheckoutButton`: Opens confirm dialog or navigates to confirm route.
- `CheckoutResult`: Success/failure screen after order placement.
- `OrderSummary`: Confirmed cart details, bill estimate, and delivery assumptions.
- `CheckoutSafetyNotice`: COD-only, cannot-cancel, and Dineout free-booking warning text.

### Shared/UI

- `Button`: Shared button variants with lucide icon support.
- `IconButton`: Fixed-size icon button with tooltip.
- `Card`: Shared rounded-xl card surface.
- `Tabs`: Shared tab primitives.
- `Input`: Shared text input.
- `Textarea`: Shared textarea.
- `Badge`: Shared label/status chip.
- `Tooltip`: Hover/focus tooltip for icon-only controls.
- `Skeleton`: Loading placeholder.
- `Alert`: Error/warning/info callout.
- `Dialog`: Accessible modal wrapper.
- `Divider`: Shared separator.
- `Stepper`: Shared numeric stepper base.

## State Management Approach

- Local component state:
  - Active recipe source tab, input text/URLs, upload selection, sidebar/mobile drawer state, dialog open state, and simple form errors.
  - Reason: these values are UI-local and do not need to survive navigation.
- Global client state with React context and reducer:
  - Current cart, generated cart session, selected serving count, extracted ingredients under review, mock/real mode flag, and checkout confirmation state.
  - Reason: these values are shared by the main content, persistent cart panel, and checkout routes.
- Server state through API routes and typed service functions:
  - Gemini extraction responses, Swiggy MCP auth status, Instamart product search results, bill estimates, and checkout result.
  - Reason: these calls require secrets/tokens or server-side service boundaries and should not expose credentials to the browser.
- Persistence:
  - Stage 1-3 can use in-memory/mock data only.
  - Later stages can add `localStorage` for saved recipes/carts if no database is requested.
  - A database is not planned unless the user asks for multi-device persistence or real accounts.

## Data Flow

```text
recipe input
  -> validate input by source type
  -> /api/extract or ingestion route
  -> Gemini extraction
  -> strict structured ingredient JSON
  -> IngredientReviewList for user review
  -> selected serving count
  -> proportional quantity scaling
  -> /api/cart/build
  -> Instamart item search through Swiggy MCP client, or mock service if unavailable
  -> match ranking by ingredient name, unit compatibility, availability, price, and pack metadata
  -> pack-size selection using actual returned pack sizes
  -> generated cart state
  -> cart review and quantity edits
  -> checkout confirmation dialog/page
  -> /api/checkout
  -> Swiggy MCP order call, or mocked order result
  -> checkout result screen and order history entry
```

## Folder Structure

```text
app/
    layout.tsx
    page.tsx
    globals.css
    recipes/
      page.tsx
      [id]/page.tsx
    carts/
      page.tsx
      [id]/page.tsx
    orders/page.tsx
    favorites/page.tsx
    price-tracker/page.tsx
    youtube-library/page.tsx
    settings/page.tsx
    help/page.tsx
    feedback/page.tsx
    checkout/
      confirm/page.tsx
      result/page.tsx
    api/
      extract/route.ts
      ingest/
        youtube/route.ts
        instagram/route.ts
      cart/build/route.ts
      checkout/route.ts
      mcp/
        auth/[server]/route.ts
        callback/route.ts
        status/route.ts
components/
  layout/
  recipe-input/
  extraction/
  cart/
  checkout/
  shared/
contexts/
  cart-context.tsx
  recipe-session-context.tsx
lib/
  gemini/
    client.ts
    prompts.ts
    schemas.ts
  swiggy/
    mcp-client.ts
    auth.ts
    services.ts
    mock-services.ts
    types.ts
  cart/
    scale-ingredients.ts
    match-products.ts
    pack-size.ts
    totals.ts
  mock/
    recipes.ts
    cart.ts
    products.ts
  utils/
    currency.ts
    units.ts
    validation.ts
types/
  recipe.ts
  ingredient.ts
  cart.ts
  swiggy.ts
public/
  recipe-images/
docs/
  references/
.env.local.example
```

## Environment Variables

- `GEMINI_API_KEY`: Server-side Gemini API key used by `/api/extract` and ingestion routes.
- `GEMINI_MODEL`: Optional Gemini model override; defaults to the current selected structured-output model in code.
- `SWIGGY_MCP_FOOD_URL`: Food MCP endpoint, expected default `https://mcp.swiggy.com/food`.
- `SWIGGY_MCP_IM_URL`: Instamart MCP endpoint, expected default `https://mcp.swiggy.com/im`.
- `SWIGGY_MCP_DINEOUT_URL`: Dineout MCP endpoint, expected default `https://mcp.swiggy.com/dineout`.
- `SWIGGY_MCP_CLIENT_ID`: OAuth client identifier if Swiggy issues one for this app.
- `SWIGGY_MCP_CLIENT_SECRET`: Optional OAuth client secret if required by the approved client profile.
- `SWIGGY_MCP_REDIRECT_URI`: Local callback URL for MCP OAuth, for example `http://localhost:3000/api/mcp/callback`.
- `SWIGGY_MCP_TOKEN_STORE_KEY`: Optional encryption or namespace key for server-side token storage.
- `NEXT_PUBLIC_APP_MODE`: Public UI label such as `development`, `demo`, or `production`.
- `NEXT_PUBLIC_ENABLE_MOCKS`: Public flag for displaying mock mode when server credentials/auth are missing.

## Open Questions and Assumptions

- Confirmed: Stage 1 creates the Next.js app directly in the current workspace root.
- Confirmed: Saved recipes, carts, and orders use `localStorage` for this demo. No database is planned.
- Confirmed: Upload support is `.txt` only for now. PDF and image parsing are out of scope.
- Assumption: The visual target is the supplied screenshot; static UI should closely match spacing, cards, orange accent, neutral grays, and persistent right cart.
- Assumption: All iconography will use `lucide-react`, with no emoji in code, UI copy, or comments.
- Assumption: Instamart checkout must always require an explicit confirmation step and visibly state COD-only and cannot-cancel constraints.
- Assumption: Dineout will be represented in the MCP service layer and safety warnings, but not surfaced as a primary recipe-to-cart workflow unless requested later.
- Assumption: If Gemini or Swiggy credentials are missing, the app remains runnable through clearly labeled mock services.

## Route Scope

- Core routes: `/`, `/recipes`, `/recipes/[id]`, `/carts`, `/carts/[id]`, `/checkout/confirm`, `/checkout/result`, and all `/api/*` routes.
- Stub routes until explicitly expanded: `/orders`, `/favorites`, `/price-tracker`, `/youtube-library`, `/settings`, `/help`, and `/feedback`.
- `/youtube-library` becomes real in Stage 7 per the ingestion plan.

## Documentation Notes

- Swiggy Builders Club currently documents three independent MCP servers: Food, Instamart, and Dineout.
- Swiggy docs describe streamable HTTP transport and OAuth 2.1 with PKCE.
- The public Swiggy manifest lists Instamart product search, cart management, and COD order placement, while Dineout supports free table bookings.
- The implementation should treat production Swiggy access as gated/whitelisted and keep local development functional through mock mode.
