//% color="#0099FF" icon="\uf03e" block="תמונות"
namespace customImages {

    let targetImage: Image = null;
    let imageHandler: () => void = null;

    /**
     * מפעיל קוד כאשר תמונת הלדים שנגררה לבלוק מוצגת על המסך
     * @param img התמונה לבדיקה
     * @param handler הקוד שירוץ
     */
    //% block="כאשר מוצגת תמונה %img| עשה"
    //% img.shadow="screen_image_picker"
    //% topblock=false
    //% handlerStatement=true
    export function onImageDisplayed(img: Image, handler: () => void): void {
        targetImage = img;
        imageHandler = handler;
    }

    /**
     * פונקציה פנימית שרצה ברקע ובודקת באופן קבוע אם המסך תואם לתמונה המבוקשת
     */
    control.inBackground(function () {
        while (true) {
            if (targetImage && imageHandler) {
                if (isImageOnScreen(targetImage)) {
                    imageHandler();
                    // השהייה קלה כדי למנוע לולאה אינסופית מהירה מדי בזמן שהתמונה מוצגת
                    basic.pause(500); 
                }
            }
            basic.pause(100); // בדיקה כל 100 מילישניות
        }
    });

    /**
     * פונקציית עזר המשווה בין התמונה שנבחרה לבין מצב הלדים הנוכחי על המסך
     */
    function isImageOnScreen(img: Image): boolean {
        for (let y = 0; y < 5; y++) {
            for (let x = 0; x < 5; x++) {
                // בדיקה האם עוצמת הלד על המסך תואמת לעוצמה שבתמונה המבוקשת
                let screenBrightness = led.pointBrightness(x, y);
                let imageBrightness = img.pixel(x, y);
                
                // במיקרוביט, עוצמת לד בפיקסל תמונה היא לרוב 0 או 255 (או ערך ביניים)
                // אנו בודקים התאמה בסיסית (אם שניהם כבויים או שניהם דלוקים)
                if ((screenBrightness > 0 && imageBrightness === 0) || 
                    (screenBrightness === 0 && imageBrightness > 0)) {
                    return false; // נמצאה אי-התאמה, זו לא התמונה
                }
            }
        }
        return true; // כל הפיקסלים מתאימים!
    }
                  }
