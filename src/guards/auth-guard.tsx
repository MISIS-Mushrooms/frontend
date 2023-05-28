import { useAtomValue } from "jotai";
import PropTypes from "prop-types";
import type { FC, ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import { userIdentityAtom } from "src/atoms";
import { useRouter } from "src/hooks/use-router";
import { paths } from "src/paths";

interface AuthGuardProps {
  children: ReactNode;
}

export const AuthGuard: FC<AuthGuardProps> = (props) => {
  const { children } = props;
  const router = useRouter();
  const userIdentity = useAtomValue(userIdentityAtom);
  const [checked, setChecked] = useState(false);

  const check = useCallback(() => {
    if (!userIdentity) {
      router.replace(paths.profile);
    } else {
      setChecked(true);
    }
  }, [userIdentity, router]);

  // Only check on mount, this allows us to redirect the user manually when auth state changes
  useEffect(
    () => {
      check();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  if (!checked) {
    return null;
  }

  // If got here, it means that the redirect did not occur, and that tells us that the user is
  // authenticated / authorized.

  return <>{children}</>;
};

AuthGuard.propTypes = {
  children: PropTypes.node,
};
