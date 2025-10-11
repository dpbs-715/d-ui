import type { PropType } from 'vue';

export interface FomaProps {
  editorMaxHeight?: number;
  allowedVars?: string[];
  allowedFuns?: string[];
}

export interface VarType {
  label: string;
  value: string;
}

export const FomaProps = {
  maxHeight: {
    type: Number,
    default: 400,
  },
  minHeight: {
    type: Number,
    default: 200,
  },
  allowedVars: {
    type: Array as PropType<Array<VarType>>,
    default: () => [],
  },
  allowedFuns: {
    type: Array,
    default: () => [],
  },
};
