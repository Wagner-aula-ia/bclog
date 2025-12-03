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
  DialogDescription,
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
      clientName: "",
      quantity: 1,
      storageType: "palete",
      entryDate: format(new Date(), "yyyy-MM-dd"),
      address: "",
      observations: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        productName: initialData?.productName || "",
        productCode: initialData?.productCode || "",
        clientName: initialData?.clientName || "",
        quantity: initialData?.quantity || 1,
        storageType: initialData?.storageType || "palete",
        entryDate: initialData?.entryDate || format(new Date(), "yyyy-MM-dd"),
        address: initialData?.address || "",
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
          <DialogDescription>
            Preencha os dados do produto abaixo
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Cliente</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Empresa ABC Ltda"
                      {...field}
                      data-testid="input-client-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                  <FormLabel>Codigo do Produto</FormLabel>
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

            <div className="flex gap-4 items-start">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem className="w-24">
                    <FormLabel>Quantidade</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        className="w-full"
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
                name="storageType"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Tipo</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="granel" id="granel" />
                          <label htmlFor="granel" className="text-sm font-medium cursor-pointer">
                            a Granel
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="palete" id="palete" />
                          <label htmlFor="palete" className="text-sm font-medium cursor-pointer">
                            Palete
                          </label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereco (opcional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Rua das Flores, 123"
                      {...field}
                      data-testid="input-address"
                    />
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
