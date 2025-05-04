import Button from "./button";

interface TopContentProps {
  hasNewRecordButton?: boolean;
  newRecordButtonOnClick?: () => void;
  dataTarget?: string;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
}

function TopContents(props: TopContentProps) {
  return (
    <div className="row mb-3">
      <div className="col-md-6 d-flex align-items-center">
        {props.leftContent}
      </div>
      <div className="col-md-6 d-flex justify-content-end align-items-center">
        {props.rightContent}
        {props.hasNewRecordButton && (
          <div className="text-right">
            <Button
              className={"btn btn-success mb-2 mr-5 m-3"}
              text={"Add New"}
              isModalTrigger={true}
              dataTarget={props.dataTarget}
              onClick={props.newRecordButtonOnClick}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default TopContents;