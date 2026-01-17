declare module 'use-ackee' {
  export default function useAckee(
    url: string,
    server: {
      server: string;
      domainId: string;
    },
    opts?: {
      detailed?: boolean;
      ignoreLocalhost?: boolean;
      ignoreOwnVisits?: boolean;
    },
  ): void;
}
