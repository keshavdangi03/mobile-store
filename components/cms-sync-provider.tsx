"use client";

import React, { useEffect, useRef } from "react";
import { useCmsStore } from "@/lib/cms-store";
import { getDbCmsConfig } from "@/app/actions";
import { useTheme } from "./theme-provider";

export default function CmsSyncProvider({ children }: { children: React.ReactNode }) {
  const { initFromDatabase } = useCmsStore();
  const { setDesignTheme } = useTheme();
  const isHydratedRef = useRef(false);

  useEffect(() => {
    if (isHydratedRef.current) return;
    isHydratedRef.current = true;

    // Fetch live CMS configuration from PostgreSQL database
    getDbCmsConfig()
      .then((config) => {
        if (config) {
          initFromDatabase(config);

          // Synchronize design theme if set in DB
          if (config.theme) {
            setDesignTheme(config.theme);
          }

          // Apply CSS style overrides from DB
          if (config.styleOverrides && typeof config.styleOverrides === "object") {
            Object.entries(config.styleOverrides).forEach(([key, value]) => {
              if (value) {
                document.documentElement.style.setProperty(key, value as string);
              }
            });
          }

          // Dispatch event so categories and other components know DB settings are ready
          window.dispatchEvent(new CustomEvent("cms_db_synced", { detail: config }));
        }
      })
      .catch((err) => {
        console.error("Failed to load CMS config from PostgreSQL:", err);
      });
  }, [initFromDatabase, setDesignTheme]);

  return <>{children}</>;
}
