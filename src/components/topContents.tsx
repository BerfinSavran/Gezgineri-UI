import { Box, Button, Stack } from "@mui/material";

interface TopContentProps {
  hasNewRecordButton?: boolean;
  newRecordButtonOnClick?: () => void;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
}

function TopContents({
  hasNewRecordButton,
  newRecordButtonOnClick,
  leftContent,
  rightContent,
}: TopContentProps) {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={3}
      flexWrap="wrap"
      gap={2}
    >
      <Box>{leftContent}</Box>

      <Stack direction="row" spacing={2} alignItems="center">
        {rightContent}
        {hasNewRecordButton && (
          <Button variant="contained" color="primary" onClick={newRecordButtonOnClick}>
            Ekle
          </Button>
        )}
      </Stack>
    </Box>
  );
}

export default TopContents;
