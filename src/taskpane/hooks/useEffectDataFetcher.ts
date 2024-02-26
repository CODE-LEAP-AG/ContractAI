import { useEffect, useState } from "react";
import { tryCatch } from "../office-document";

/**
 * global func for using effect render data
 * @param callbackFn
 */

function useEffectDataFetcher(callbackFn: () => any) {
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await tryCatch(callbackFn);
      setData(response);
    };

    fetchData();
  }, []);

  return data;
}

export default useEffectDataFetcher;
