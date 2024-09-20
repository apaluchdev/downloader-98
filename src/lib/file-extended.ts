import { UUID } from "crypto";

interface FileExtended extends File {
  IsClicked: boolean;
  uuid: UUID;
}

export default FileExtended;
