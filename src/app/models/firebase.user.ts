export interface FirebaseUser {
    uid: string;
    displayName: string;
    email: string;
    photoURL?: string;
    roles: {
        admin: boolean;
        editor: boolean;
        viewer: boolean;
    };
}
