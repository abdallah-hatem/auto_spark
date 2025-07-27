"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    firebase: {
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    },
});
//# sourceMappingURL=firebase.config.js.map