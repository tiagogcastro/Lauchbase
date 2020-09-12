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
    input: "",
    preview: document.querySelector('#photos-preview'),
    uploadLimit: 6,
    files: [],
    handleFileInput(event) {
        const { files: fileList } = event.target
        PhotosUpload.input = event.target

        if (PhotosUpload.hasLimit(event)) return

        // Vai colocar a imagem no array
        Array.from(fileList).forEach((file) => {

            PhotosUpload.files.push(file)

            const reader = new FileReader()

            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)

                const div = PhotosUpload.getContainer(image)

                PhotosUpload.preview.appendChild(div)
            }

            reader.readAsDataURL(file)
        })

        // Trocando o comportamento padrao para o nosso
        PhotosUpload.input.files = PhotosUpload.getAllFiles()
    },

    hasLimit(event) {
        // Vai pegar o total de arquivos e verificar o limite
        const { uploadLimit, input, preview} = PhotosUpload
        const { files: fileList} = input

        if (fileList.length > uploadLimit) {
            alert(`Voce enviou ${fileList.length}. Envie no máximo ${uploadLimit} fotos`)
            event.preventDefault()
            return true
        }

        // preview é o container e childNodes é os filhos
        const photosDiv = []
        preview.childNodes.forEach(item => {
            if (item.classList && item.classList.value == "photo") {
                photosDiv.push(item)
            }
        })

        const totalPhotos = fileList.length + photosDiv.length
        if(totalPhotos > uploadLimit) {
            alert("Limite max")
            event.preventDefault()
            return true
        }

        return false
    },

    getAllFiles() {
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()

        // Adicionando cada item no dataTransfer ou atualizando
        PhotosUpload.files.forEach(file => dataTransfer.items.add(file))

        return dataTransfer.files
    },

    getContainer(image) {
        // Vai pegar e adicionar uma div e class
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

    removePhoto(event) {
        // Quando clicar na foto
        const photoDiv = event.target.parentNode // <div class="photo">
        const photosArray = Array.from(PhotosUpload.preview.children)
        const index = photosArray.indexOf(photoDiv)

        // aplica no array pra tirar uma posiçao do array
        PhotosUpload.files.splice(index, 1)
        // Roda a função de novo
        PhotosUpload.input.files = PhotosUpload.getAllFiles()

        photoDiv.remove()
    },

    removeOldPhoto(event) {
        const photoDiv = event.target.parentNode

        if (photoDiv.id) {
            const removedFiles = document.querySelector('input[name="removed_files"]')

            if (removedFiles) {
                removedFiles.value += `${photoDiv.id},`
            }
        }

        photoDiv.remove()
    }
}

const ImageGallery = {
    highlight: document.querySelector('.gallery .highlight > img'),
    previews: document.querySelectorAll('.gallery-preview img'),
    setImage(e) {
        const { target } = e

        ImageGallery.previews.forEach(preview => preview.classList.remove('active'))
        target.classList.add('active')
        
        ImageGallery.highlight.src = target.src
    }
}