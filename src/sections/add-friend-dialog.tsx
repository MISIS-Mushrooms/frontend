import {
  Box,
  Card,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import XIcon from "@untitled-ui/icons-react/build/esm/X";
import { useAtom, useSetAtom } from "jotai";
import { withImmer } from "jotai-immer";
import { addFriendDialogOpenAtom, friendIdentitiesAtom } from "src/atoms";
import { UserIdentity } from "src/types/user-identity";
import { IdentityForm } from "./identity-form";

export const AddFriendDialog = () => {
  const setFriendIdentities = useSetAtom(withImmer(friendIdentitiesAtom));
  const [open, setOpen] = useAtom(addFriendDialogOpenAtom);

  const handleIdentify = (identity: UserIdentity) => {
    setFriendIdentities((friends) => {
      friends[identity.id] = identity;
    });
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <Card>
        <DialogTitle>
          Введите данные человевка, который может составить вам компанию, чтобы
          мы смогли подобрать занятия, которые понравятся вам обоим
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <XIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box py={1}>
            <IdentityForm onIdentify={handleIdentify} />
          </Box>
        </DialogContent>
      </Card>
    </Dialog>
  );
};
