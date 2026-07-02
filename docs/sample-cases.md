# Sample Cases

Use these examples to verify the core RecipeCart flow.

## Case 1: Paste Text Recipe

Input:

```text
Paneer Butter Masala

Serves 3.

Ingredients:
250 grams paneer
2 tablespoons butter
1 tablespoon oil
2 onions, chopped
3 tomatoes, chopped
1 tablespoon ginger garlic paste
10 cashews
1 teaspoon red chilli powder
1 teaspoon garam masala
1 teaspoon coriander powder
1/2 teaspoon turmeric powder
1/2 cup cream
1 teaspoon sugar
1 teaspoon salt
2 tablespoons fresh coriander

Method:
Cook onions, tomatoes, cashews, and ginger garlic paste until soft. Blend into a smooth gravy. Heat butter and oil, add the gravy, spices, salt, and sugar. Simmer for 5 minutes. Add paneer cubes and cream, then cook for another 3 minutes. Garnish with fresh coriander.
```

Expected:

- Gemini returns structured ingredients.
- Default serving selector starts at `1`.
- Cart builds from real Instamart MCP when the browser is connected.
- Cart falls back to mock mode when MCP auth is unavailable.
- Low-confidence products show `Needs review`.
- Removing an item updates both the main cart and right rail totals.

## Case 2: YouTube Recipe

Input:

```text
https://youtu.be/2eJ0Jp2t3sU
```

Expected:

- Transcript is fetched server-side.
- Raw transcript is not displayed in the UI.
- Gemini returns structured recipe data.
- Matching pipeline rejects unrelated products.
- Cart is editable before any checkout flow.

Known good API smoke result in fallback mode:

```text
butter -> Amul Butter
garlic -> Fresh Garlic
bread -> Britannia Brown Bread
cheese -> Amul Cheese Slices
capsicum -> Green Capsicum
red pepper -> Red Bell Pepper
onion -> Fresh Onion
coriander -> Fresh Coriander
green chilli -> Green Chilli
carrot -> Fresh Carrot
salt -> Tata Salt
```

## Case 3: Remove Item

Flow:

1. Generate a cart from a recipe.
2. Click the trash icon next to any item.
3. Confirm the main cart and right rail both update.

Observed smoke result:

```text
Before: 4 Items, Rs 217
After:  3 Items, Rs 197
```

## Screenshot Set

- [Home](screenshots/home.png)
- [Generated cart](screenshots/generated-cart.png)
- [Remove item](screenshots/remove-item.png)
- [Mobile home](screenshots/mobile-home.png)

## Presentation Assets

- [Presentation deck](media/recipecart-presentation.pdf)
- [Product walkthrough video](media/recipecart-demo.webm)
