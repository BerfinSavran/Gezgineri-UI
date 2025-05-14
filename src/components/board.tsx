import TopContents from "./topContents";
import DataTable from "./dataTable";

interface BoardProps {
  hasDataTable?: boolean;
  items?: any[] | null;
  onApprove?: (item: any) => void;
  onDeny?: (item: any) => void;
  isApprovable?: (item: any) => boolean;
  isDeniable?: (item: any) => boolean;
  hiddenColumns?: string[];
  renderColumn?: (column: string, value: any) => JSX.Element | string;
  columnNames?: { [key: string]: string };
  hasNewRecordButton?: boolean;
  newRecordButtonOnClick?: () => void;
  newRecordModalDataTarget?: string;
  hideActions?: string;
  customElementOfActions?: (item: any) => JSX.Element;
  customColumn?: (item: any) => JSX.Element;
  leftTopContent?: React.ReactNode;
  rightTopContent?: React.ReactNode;
  isCustomColumnExist?: string,
}

function Board({
  hasDataTable = true,
  items,
  onApprove,
  onDeny,
  isApprovable,
  isDeniable,
  hiddenColumns,
  renderColumn,
  columnNames,
  hasNewRecordButton,
  newRecordButtonOnClick,
  newRecordModalDataTarget,
  hideActions = "false",
  customElementOfActions,
  customColumn,
  leftTopContent,
  rightTopContent,
  isCustomColumnExist = "false"
}: BoardProps) {
  const renderedItems = items ?? [];

  return (
    <>
      <TopContents
        hasNewRecordButton={hasNewRecordButton}
        newRecordButtonOnClick={newRecordButtonOnClick}
        leftContent={leftTopContent}
        rightContent={rightTopContent}
      />
      {hasDataTable ? (
        <DataTable
          items={renderedItems}
          onApprove={onApprove}
          onDeny={onDeny}
          isApprovable={isApprovable}
          isDeniable={isDeniable}
          hiddenColumns={hiddenColumns}
          renderColumn={renderColumn}
          dataTarget={newRecordModalDataTarget}
          columnNames={columnNames}
          hideActions={hideActions}
          customElementOfActions={customElementOfActions}
          customColumn={customColumn}
          isCustomColumnExist={isCustomColumnExist}
        />
      ) : (
        []
      )}
    </>
  );
}

export default Board;