import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { productFormSchema, type ProductFormData } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Package } from "lucide-react";
import { format } from "date-fns";

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => void;
  initialData?: Partial<ProductFormData>;
  title: string;
  isLoading?: boolean;
}

export function ProductFormModal({
  open,
  onClose,
  onSubmit,
  initialData,
  title,
  isLoading,
}: ProductFormModalProps) {
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      productName: "",
      productCode: "",
      quantity: 1,
      entryDate: format(new Date(), "yyyy-MM-dd"),
      observations: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        productName: initialData?.productName || "",
        productCode: initialData?.productCode || "",
        quantity: initialData?.quantity || 1,
        entryDate: initialData?.entryDate || format(new Date(), "yyyy-MM-dd"),
        observations: initialData?.observations || "",
      });
    }
  }, [open, initialData, form]);

  const handleSubmit = (data: ProductFormData) => {
    onSubmit(data);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]" data-testid="product-form-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Package className="h-4 w-4" />
            </div>
            {title}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="productName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Produto</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Caixa de Papelao"
                      {...field}
                      data-testid="input-product-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="productCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Codigo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: SKU-001"
                      {...field}
                      data-testid="input-product-code"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      data-testid="input-quantity"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="entryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Entrada</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} data-testid="input-entry-date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="observations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observacoes (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Notas adicionais sobre o produto..."
                      className="resize-none"
                      {...field}
                      data-testid="input-observations"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                data-testid="button-cancel"
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading} data-testid="button-save">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
