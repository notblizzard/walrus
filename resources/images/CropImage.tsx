import React, { useState } from "react";
import { Dialog, Button, makeStyles, Theme } from "@material-ui/core";
import ReactCrop from "react-image-crop";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

interface CropImageProps {
  url: string;
  open: boolean;
  onClose: (e: React.MouseEvent<HTMLButtonElement>) => void;
  imageRef: HTMLImageElement;
}

const useStyles = makeStyles((theme: Theme) => ({
  successToastify: {
    backgroundColor: "#4f7c54",
    color: "#eee",
  },
}));

const CropImage = ({
  url,
  open,
  onClose,
  imageRef,
}: CropImageProps): JSX.Element => {
  const csrf = Cookies.get("X-CSRF-TOKEN")!;
  const classes = useStyles();
  const [actualImage, setActualImage] = useState<HTMLImageElement>();
  const [crop, setCrop] = useState<ReactCrop.Crop>({ aspect: 1 });

  const handleImageLoaded = (image: HTMLImageElement): void => {
    setActualImage(image);
  };

  const saveImage = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ): Promise<void> => {
    imageRef = actualImage!;
    const canvas = document.createElement("canvas");
    const scaleX = imageRef.naturalWidth / imageRef.width;
    const scaleY = imageRef.naturalHeight / imageRef.height;
    canvas.width = crop.width!;
    canvas.height = crop.height!;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(
        imageRef,
        crop.x! * scaleX,
        crop.y! * scaleY,
        crop.width! * scaleX,
        crop.height! * scaleY,
        0,
        0,
        crop.width!,
        crop.height!,
      )!;
    }
    const fileUrl: string = await new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        let fileUrl = "";
        window.URL.revokeObjectURL(fileUrl);
        fileUrl = window.URL.createObjectURL(blob);
        resolve(fileUrl);
      }, "image/png");
    });

    const form = new FormData();

    const imageBlob = await fetch(fileUrl).then((r) => r.blob());
    form.append("image", imageBlob);
    fetch("/api/upload-avatar", {
      method: "POST",
      body: form,
      headers: {
        "X-CSRF-Token": csrf,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          localStorage.setItem("avatar", data.avatar);
          toast("Avatar created and set!", {
            position: "bottom-right",
            hideProgressBar: true,
            pauseOnHover: true,
            draggable: false,
            className: classes.successToastify,
            //bodyClassName: classes.successToastify,
          });
        }
      });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <ReactCrop
        src={url}
        crop={crop}
        onImageLoaded={handleImageLoaded}
        onChange={(newCrop) => setCrop(newCrop)}
        circularCrop
      />
      <Button onClick={saveImage}>OK</Button>
    </Dialog>
  );
};

export default CropImage;
