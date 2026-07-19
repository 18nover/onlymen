import type { Evaluator, RegisteredEvaluator } from "../../../types/index.js";
import { type SkillTrajectoryService, type SkillTrajectory as Trajectory } from "./trajectory-evaluator-utils.js";
interface SkillProposalOutput {
    extract: boolean;
    reason: string;
    name?: string;
    description?: string;
    body?: string;
}
interface SkillRefinementOutput {
    refinements: Array<{
        skillName: string;
        refine: boolean;
        reason: string;
        newBody?: string;
    }>;
}
interface ProposalPrepared {
    service: SkillTrajectoryService;
    trajectory: Trajectory;
    trajectoryDigest: string;
}
interface RefinementPrepared {
    service: SkillTrajectoryService;
    trajectory: Trajectory;
    trajectoryDigest: string;
    skills: Array<{
        name: string;
        path: string;
        frontmatter: Record<string, unknown>;
        body: string;
    }>;
}
export declare const skillProposalEvaluator: Evaluator<SkillProposalOutput, ProposalPrepared>;
export declare const skillRefinementEvaluator: Evaluator<SkillRefinementOutput, RefinementPrepared>;
export declare const skillItems: RegisteredEvaluator[];
export declare function _countProposedSkills(): number;
export {};
//# sourceMappingURL=skill-items.d.ts.map