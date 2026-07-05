# TODO - Fix Axios "Network Error" in Shop frontend

## Plan (approved to implement after confirmation)
1. Create shared API config/constants for:
   - backend base URL
   - uploads base URL
2. Update `src/services/api.js` to use the config and export `api` instance.
3. Replace hardcoded `http://localhost/shop-aya-backend/api/...` calls across pages with `api` usage.
4. Replace hardcoded upload image URLs across pages with the shared uploads base URL.
5. Add consistent axios error handling helper (optional) so failures don’t crash UI.
6. Run `npm test` / `npm run build` (or at least `npm run build`) to ensure no syntax errors.

## Progress
- [x] Read key pages and found widespread hardcoded `http://localhost/shop-aya-backend/...` URLs.
- [ ] Implement centralized base URLs + update requests to use `services/api.js`.
- [ ] Update image URLs to use shared uploads base.
- [ ] Build to confirm.

