import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { DEFAULT_FONT_ID, type FontId } from './fonts';
import { DEFAULT_PAPER_ID } from '@/components/paper/papers';

export type Address = {
  name: string;
  zonecode: string;
  address: string;
  detail: string;
  phone?: string;
};

export type LetterState = {
  paperId: string;
  font: FontId;
  to: string;
  body: string;
  from: string;
  recipient: Address;
  sender: Address;
};

type TextPatch = Partial<Pick<LetterState, 'to' | 'body' | 'from'>>;

type LetterStore = LetterState & {
  /** sessionStorage 복원이 끝났는지. 페이지 가드는 이 값이 true일 때만 판단한다 */
  hydrated: boolean;
  setHydrated: (v: boolean) => void;
  setPaper: (id: string) => void;
  setFont: (font: FontId) => void;
  setText: (patch: TextPatch) => void;
  setRecipient: (a: Address) => void;
  setSender: (a: Address) => void;
  reset: () => void;
};

export const emptyAddress: Address = { name: '', zonecode: '', address: '', detail: '', phone: '' };

const initialState: LetterState = {
  paperId: DEFAULT_PAPER_ID,
  font: DEFAULT_FONT_ID,
  to: '',
  body: '',
  from: '',
  recipient: { ...emptyAddress },
  sender: { ...emptyAddress },
};

export const useLetterStore = create<LetterStore>()(
  persist(
    (set) => ({
      ...initialState,
      hydrated: false,
      setHydrated: (v) => set({ hydrated: v }),
      setPaper: (paperId) => set({ paperId }),
      setFont: (font) => set({ font }),
      setText: (patch) => set(patch),
      setRecipient: (recipient) => set({ recipient }),
      setSender: (sender) => set({ sender }),
      reset: () => set({ ...initialState, recipient: { ...emptyAddress }, sender: { ...emptyAddress } }),
    }),
    {
      name: 'handletter-letter',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (s) => ({
        paperId: s.paperId,
        font: s.font,
        to: s.to,
        body: s.body,
        from: s.from,
        recipient: s.recipient,
        sender: s.sender,
      }),
      onRehydrateStorage: () => (state) => state?.setHydrated(true),
    },
  ),
);
