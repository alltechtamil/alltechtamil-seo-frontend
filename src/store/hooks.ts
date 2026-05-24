import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from ".";

/**
 * Typed useDispatch hook for AllTechTamil's store actions.
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Typed useSelector hook to select slices from the global root state.
 */
export const useAppSelector = <TSelected>(
  selector: (state: RootState) => TSelected
) => useSelector<RootState, TSelected>(selector);
