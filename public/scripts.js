const Mask = {
    apply(input, func) {
        setTimeout(function() {
            //  pegar o value do input e rodar a function passando o value para a function
            input.value = Mask[func](input.value)
        }, 1)
    },
    formatBRL(value) {    
        value = value.replace(/\D/g, "")
    
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value / 100)
    }
}

const PhotosUpload = {
    preview: document.querySelector('#photos-preview'),
    uploadLimit: 6,
    handleFileInput(event) {
        const { files: fileList } = event.target

        if (PhotosUpload.hasLimit(event)) return

        // Vai colocar a imagem no array
        Array.from(fileList).forEach((file) => {
            const reader = new FileReader()

            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)

                const div = PhotosUpload.getContainer(image)

                PhotosUpload.preview.appendChild(div)
            }

            reader.readAsDataURL(file)
        })
    },

    hasLimit(event) {
        // Vai pegar o total de arquivos e verificar o limite
        const { uploadLimit } = PhotosUpload
        const { files: fileList } = event.target

        if (fileList.length > uploadLimit) {
            alert(`Voce enviou ${fileList.length}. Envie no máximo ${uploadLimit} fotos`)
            event.preventDefault()
            return true
        }

        return false
    },

    // Vai pegar e adicionar uma div e class
    getContainer(image) {
        const div = document.createElement('div')
        div.classList.add('photo')

        div.onclick = PhotosUpload.removePhoto

        div.appendChild(image)

        div.appendChild(PhotosUpload.getRemoveButton())

        return div
    },
    
    getRemoveButton() {
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = 'close'

        return button
    },

    // Quando clicar na foto
    removePhoto(event) {
        const photoDiv = event.target.parentNode
        const photosArray = Array.from(PhotosUpload.preview.children)
        const index = photosArray.indexOf(photoDiv)

        photoDiv.remove()
    }
}