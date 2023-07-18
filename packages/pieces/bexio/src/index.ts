
import { createPiece, PieceAuth } from "@activepieces/pieces-framework";
import actions from "./lib/actions";
import { bexioCommon } from "./lib/common";

export const bexio = createPiece({
  displayName: "Bexio",
  auth: bexioCommon.auth,
  minimumSupportedRelease: '0.5.0',
  logoUrl: "https://cdn.activepieces.com/pieces/bexio.png",
  authors: ['JanHolger'],
  actions: actions,
  triggers: [],
});
