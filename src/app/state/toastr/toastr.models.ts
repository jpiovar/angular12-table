export interface ToastrState {
  isOn?: boolean;
  duration?: number;
  title?: string;
  text: string;
  type?: 'info'|'success'|'warning'|'error'|'';
}
