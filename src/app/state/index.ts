import { SpinnerState } from './spinner/spinner.models';
import { ToastrState } from './toastr/toastr.models';
import { RecordsState } from './records/records.models';
import { UserState } from './user/user.models';
import { LogsState } from './logs/logs.models';
import { RecordsBaseState } from './records-base/records-base.models';

export interface AppState {
  readonly router: any;
  readonly spinner: SpinnerState;
  readonly toastr: ToastrState;
  readonly records: RecordsState;
  readonly user: UserState;
  readonly logs: LogsState;
  readonly recordsBase: RecordsBaseState;
}
