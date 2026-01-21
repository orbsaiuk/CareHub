import { useState, useEffect } from "react";
import {
  getCompanyTypes,
  getSupplierTypes,
} from "@/services/sanity/businessTypes";


export function useBusinessTypes(entityType) {
  const [businessTypes, setBusinessTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBusinessTypes() {
      try {
        setLoading(true);
        let types = [];

        if (entityType === "company") {
          types = await getCompanyTypes();
        } else if (entityType === "supplier") {
          types = await getSupplierTypes();
        }

        setBusinessTypes(types);
        setError(null);
      } catch (err) {
        console.error("Error fetching business types:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    if (entityType) {
      fetchBusinessTypes();
    }
  }, [entityType]);

  return {
    businessTypes,
    loading,
    error,
  };
}

export function useBusinessTypesByCategory(category) {
  const [businessTypes, setBusinessTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBusinessTypes() {
      try {
        setLoading(true);
        let types = [];

        if (category === "company") {
          types = await getCompanyTypes();
        } else if (category === "supplier") {
          types = await getSupplierTypes();
        }

        setBusinessTypes(types);
        setError(null);
      } catch (err) {
        console.error(`Error fetching ${category} types:`, err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    if (category) {
      fetchBusinessTypes();
    }
  }, [category]);

  return {
    businessTypes,
    loading,
    error,
  };
}


