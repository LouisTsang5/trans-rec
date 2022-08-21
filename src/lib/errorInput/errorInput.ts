import { useEffect, useState } from 'react';

export function useErrorInput(init?: boolean) {
    const [isError, setIsError] = useState(init === undefined ? false : init);
    useEffect(() => {
        if (!isError) return;
        const timeout = setTimeout(() => setIsError(false), 450);
        return () => clearTimeout(timeout);
    }, [isError]);
    return [isError, setIsError] as const;
}