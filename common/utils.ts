import { useEffect } from "react";
import { OneSignalAppId } from "@common/constants"

export const useOneSignal = () =>
  useEffect(() => {
    window.OneSignal = window.OneSignal || [];
    OneSignal.push(function () {
      OneSignal.init({
        appId: OneSignalAppId,
        notifyButton: {
          enable: true,
        },
        allowLocalhostAsSecureOrigin: true,
      });
    });

    return () => {
      window.OneSignal = undefined;
    };
  }, []); // <-- run this effect once on mount


export type Writeable<T> = { -readonly [P in keyof T]: T[P] };
