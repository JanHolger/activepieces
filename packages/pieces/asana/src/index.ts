import { createPiece } from "@activepieces/pieces-framework";
import { asanaCommon } from "./lib/common";
import actions from "./lib/actions";
import triggers from "./lib/triggers";

export const asana = createPiece({
    displayName: "Asana",
    minimumSupportedRelease: '0.5.0',
    logoUrl: 'https://cdn.activepieces.com/pieces/asana.png',
    authors: ['abuaboud', 'JanHolger'],
    auth: asanaCommon.auth,
    actions,
    triggers,
})
