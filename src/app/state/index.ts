import { SpinnerState } from './spinner/spinner.models';
import { ToastrState } from './toastr/toastr.models';
import { RecordsState } from './records/records.models';
import { UserState } from './user/user.models';
import { LogsState } from './logs/logs.models';
import { RecordsBaseState } from './records-base/records-base.models';
import { TablesState } from './tables/tables.models';
import { ExportState } from './export/export.models';
import { RecordsBaseExtendedState } from './records-base-extended/records-base-extended.models';

export interface AppState {
  readonly router: any;
  readonly spinner: SpinnerState;
  readonly toastr: ToastrState;
  readonly records: RecordsState;
  readonly user: UserState;
  readonly logs: LogsState;
  readonly recordsBase: RecordsBaseState;
  readonly tables: TablesState;
  readonly exportState: ExportState;
  readonly recordsBaseExtended: RecordsBaseExtendedState;
}
