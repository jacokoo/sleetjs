import { SleetPlugin, SleetOptions, SleetOutput } from '../sleet'
import { CompileResult } from '../ast';

export default {
    compile (input: CompileResult, options: SleetOptions): SleetOutput {
        return {
            code: ''
        }
    }
} as SleetPlugin
