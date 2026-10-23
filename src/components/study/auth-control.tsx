"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Github, LogIn, LogOut, UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AuthControl() {
  const { data: session, status } = useSession();
  const authEnabled = process.env.NEXT_PUBLIC_AUTH_ENABLED === "true";

  if (!authEnabled) {
    return (
      <Badge variant="outline" className="hidden h-9 items-center gap-1.5 px-2.5 sm:inline-flex">
        <UserRound className="size-3.5" aria-hidden />
        Modo local
      </Badge>
    );
  }

  if (status === "loading") {
    return <Button variant="outline" size="sm" className="h-9" disabled>Carregando…</Button>;
  }

  if (!session?.user) {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-9 gap-2"
        onClick={() => void signIn("github")}
      >
        <Github className="size-4" aria-hidden />
        <span className="hidden sm:inline">Entrar</span>
        <LogIn className="size-3.5 sm:hidden" aria-hidden />
      </Button>
    );
  }

  const user = session.user;
  const fallback = (user.name || user.email || "G").slice(0, 1).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-9 gap-2 rounded-full px-1.5 sm:px-2" aria-label="Abrir perfil">
          <Avatar className="size-7">
            <AvatarImage src={user.image ?? undefined} alt="" />
            <AvatarFallback className="text-xs">{fallback}</AvatarFallback>
          </Avatar>
          <span className="hidden max-w-32 truncate text-xs sm:inline">{user.name || "Perfil"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <span className="block truncate text-sm font-medium">{user.name || "Conta GitHub"}</span>
          {user.email ? <span className="mt-1 block truncate text-xs text-muted-foreground">{user.email}</span> : null}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => void signOut()}>
          <LogOut className="mr-2 size-4" aria-hidden />
          Sair da conta
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
