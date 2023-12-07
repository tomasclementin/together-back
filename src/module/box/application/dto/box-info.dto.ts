import { PhaseInfoDto } from '@/module/phase/application/dto/phase-info.dto';

export class BoxInfoDto {
  id: number;
  title: string;
  description: string;
  phases: PhaseInfoDto[];
}
