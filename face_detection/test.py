import cv2

cap = cv2.VideoCapture("http://192.168.1.25:8080/?action=stream")
# cap.set(3, 640)  # WIDTH
# cap.set(4, 480)  # HEIGHT

#face_cascade = cv2.CascadeClassifier('haarcascade_profileface.xml')
face_cascade = cv2.CascadeClassifier('HS.xml')

while True:
    # Capture frame-by-frame
    ret, frame = cap.read()

    # Our operations on the frame come here
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.4, 3, cv2.CASCADE_SCALE_IMAGE)
    #print(len(faces))
    # Display the resulting frame
    for (x, y, w, h) in faces:
        cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)
        roi_gray = gray[y:y + h, x:x + w]
        roi_color = frame[y:y + h, x:x + w]

        (top, right, bottom, left) = (x, y, w, h)
        top *= 4
        right *= 4
        bottom *= 4
        left *= 4

        # font = cv2.FONT_HERSHEY_DUPLEX
        # cv2.putText(frame, "Unknown", (left + 6, bottom - 6), font, 1.0, (255, 255, 255), 1)

    cv2.imshow('frame', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# When everything done, release the capture
cap.release()
cv2.destroyAllWindows()
