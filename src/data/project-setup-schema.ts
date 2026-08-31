import { z } from 'zod'

export const projectSetupSchema = z.object({
  name: z.string().trim().min(2, 'Give the project a name.'),
  problem: z.string().trim().min(10, 'Describe the problem in a sentence or two.'),
  productService: z.string().trim().min(5, 'Describe what you’re designing.'),
  targetUsers: z.string().trim().min(5, 'Describe who this affects.'),
  businessGoal: z.string().trim().min(5, 'Describe what the organisation wants to achieve.'),
  constraints: z.string().trim().optional(),
  evidence: z.string().trim().optional(),
})

export type ProjectSetupValues = z.infer<typeof projectSetupSchema>

export const PROJECT_SETUP_DEFAULTS: ProjectSetupValues = {
  name: '',
  problem: '',
  productService: '',
  targetUsers: '',
  businessGoal: '',
  constraints: '',
  evidence: '',
}
