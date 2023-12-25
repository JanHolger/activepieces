import { asanaCommon } from "./lib/common";
import actions from "./lib/actions";
import triggers from "./lib/triggers";
import { PieceAuth, createPiece } from "@activepieces/pieces-framework";

export const asanaAuth = PieceAuth.OAuth2({
    description: "",
    authUrl: "https://app.asana.com/-/oauth_authorize",
    tokenUrl: "https://app.asana.com/-/oauth_token",
    required: true,
    scope: ['default'],
});

export const asana = createPiece({
    displayName: "Asana",
    minimumSupportedRelease: '0.5.0',
    logoUrl: 'https://cdn.activepieces.com/pieces/asana.png',
    authors: ['abuaboud', 'JanHolger'],
    auth: asanaCommon.auth,
    actions,
    triggers,
})
