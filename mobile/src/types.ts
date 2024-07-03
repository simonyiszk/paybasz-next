export enum statusEnum {
  OK,
  WAITING_FOR_CARD,
  WAITING_FOR_USERID,
  WAITING_FOR_AMOUNT,
  SHOWING_BALANCE,
  SHOWING_CARD_ID,
  SUCCESS,
  LOADING,
}
export type TerminalData = {
  terminalName: string;
  terminalToken: string;
};
