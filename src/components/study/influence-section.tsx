import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Prompt } from "@/data/types";

/** Tabela "Linhas de Influência Direta entre os Prompts" (Parte I). */
export function InfluenceSection({ prompts }: { prompts: Prompt[] }) {
  const sources = prompts.filter((p) => p.influences.length > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-xl">
          Linhas de Influência Direta
        </CardTitle>
        <CardDescription>
          O diagrama abaixo é textual — mostra quais Prompts alimentam quais,
          independentemente da ordem numérica.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="study-scroll overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[190px]">Prompt Fonte</TableHead>
                <TableHead>Influencia Diretamente</TableHead>
                <TableHead className="min-w-[240px]">Conceito Transmitido</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sources.map((prompt) =>
                prompt.influences.map((influence, index) => (
                  <TableRow key={`${prompt.id}-${index}`}>
                    <TableCell>
                      {index === 0 ? (
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="font-mono text-[11px]"
                          >
                            {prompt.id}
                          </Badge>
                          <span className="text-sm font-medium">
                            {prompt.title}
                          </span>
                        </div>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {influence.influencedIds.map((id) => (
                          <Badge
                            key={id}
                            variant="outline"
                            className="font-mono text-[11px]"
                          >
                            {id}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm leading-relaxed text-muted-foreground">
                      {influence.conceptTransmitted}
                    </TableCell>
                  </TableRow>
                )),
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
